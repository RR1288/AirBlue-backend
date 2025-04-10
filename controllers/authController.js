const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const {User, UserLogin, UserOrganization} = require("../models");
const bcrypt = require("bcryptjs");

const {sendSuccess, sendError} = require("../utils/responseHelpers");

// Generate token
const generateTokenPair = (user) => {
    const roles =
        user.UserOrganizations.length > 0
            ? user.UserOrganizations[0].Roles
            : "";
    const organizationID =
        user.UserOrganizations.length > 0
            ? user.UserOrganizations[0].OrganizationID
            : null;

    const accessToken = jwt.sign(
        {id: user.UserID, username: user.UserName, roles, OrganizationID: organizationID},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "1h"}
    );

    const refreshToken = jwt.sign(
        {id: user.UserID, username: user.UserName, roles},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"}
    );

    return {accessToken, refreshToken};
};

const refreshTokensBlacklist = [];
const isTokenRevoked = (token) => refreshTokensBlacklist.includes(token);

// Login
exports.login = async (req, res) => {
    try {
        // Get username and password
        const {username, password} = req.body;
        // Find user
        const user = await User.findOne({
            where: {UserName: username},
            include: [UserLogin, UserOrganization],
        });
        if (!user) return sendError(res, "Invalid credentials", 400);

        // Compare passwords
        const userPass = user.UserLogin.Password;
        const isMatch = await bcrypt.compare(password, userPass.trim());
        if (!isMatch) return sendError(res, "Invalid credentials", 400);

        // Prepare user info to return
        const userInfo = {
            userId: user.UserID,
            username: user.UserName,
            roles: user.UserOrganizations[0]?.dataValues.Roles || "",
        };

        // If 2FA is enabled
        if (user.UserLogin.two_fa_enabled) {
            return sendSuccess(res, "2FA required", {
                two_fa_required: true,
                ...userInfo,
            });
        }

        // Generate tokens
        const {accessToken, refreshToken} = generateTokenPair(user);

        // DO NOT SET REFRESH TOKEN IN COOKIE if 2FA is not enabled
        return sendSuccess(res, "Login successful", {
            token: accessToken,
            ...userInfo,
        });
    } catch (err) {
        console.error(err);
        return sendError(res, "Server error", 500);
    }
};

// setup2FA
exports.setup2FA = async (req, res) => {
    try {
        const user = req.user; // UserLogin info

        // Generate TOTP secret
        const secret = speakeasy.generateSecret({
            name: "AirBlue",
            length: 20, //Common length
        });

        // Update secret
        user.two_fa_secret = secret.base32;
        user.two_fa_enabled = true;

        // Save
        await user.save();

        // Generate QR code
        const otpAuthURL = secret.otpauth_url;
        const qrCodeDataURL = await qrcode.toDataURL(otpAuthURL);

        return sendSuccess(res, "2FA setup successful", {
            qrCode: qrCodeDataURL,
        });
    } catch (err) {
        console.error(err);
        return sendError(res, "Failed to setup 2FA", 500);
    }
};

// verify2FA
exports.verify2FA = async (req, res) => {
    try {
        const {userId, twoFactorCode} = req.body;

        // Fetch user by userId
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: UserLogin,
                    required: true,
                    attributes: ["two_fa_enabled", "two_fa_secret"],
                },
                {
                    model: UserOrganization,
                    required: false,
                },
            ],
        });

        if (!user) {
            return sendError(res, "User not found", 404);
        }

        // If 2FA is not enabled
        if (!user.UserLogin.two_fa_enabled || !user.UserLogin.two_fa_secret) {
            return sendError(res, "2FA is not enabled for this user", 404);
        }

        // Verify token using speakeasy
        const verified = speakeasy.totp.verify({
            secret: user.UserLogin.two_fa_secret,
            encoding: "base32",
            token: twoFactorCode,
            window: 1, // 1 minute or more?
        });

        if (!verified) return sendError(res, "Invalid 2FA token", 400);

        // Generate access and refresh tokens
        const {accessToken, refreshToken} = generateTokenPair(user);
        // Set refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return sendSuccess(res, "2FA verification successful", {
            token: accessToken,
        });
    } catch (err) {
        console.error(err);
        return sendError(res, "Failed to verify 2FA token", 500);
    }
};

// disable2FA
exports.disable2FA = async (req, res) => {
    try {
        // Get user
        const user = req.user;
        user.two_fa_enabled = false;
        user.two_fa_secret = null;

        // Save
        await user.save();
        return sendSuccess(res, "2FA disabled successfully");
    } catch (err) {
        console.error(err);
        return sendError(res, "Failed to disable 2FA", 500);
    }
};

// refreshToken
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return sendError(res, "Refresh token missing", 401);

        // Verify refresh token
        if (isTokenRevoked(refreshToken)) {
            return sendError(res, "Refresh token revoked", 401);
        }

        // Verify refresh token
        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Fetch the user for verification
        const user = await User.findByPk(payload.id, {
            include: [UserOrganization],
        });
        if (!user) return sendError(res, "User not found", 404);

        // Generate new tokens
        const {accessToken, refreshToken: newRefreshToken} =
            generateTokenPair(user);

        // Set new refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const userInfo = {
            userId: user.UserID,
            username: user.UserName,
            roles: user.UserOrganizations[0]?.dataValues.Roles || "",
        };

        return sendSuccess(res, "Token refreshed successfully", {
            token: accessToken,
            ...userInfo,
        });
    } catch (err) {
        console.error(err);
        return sendError(res, "Invalid or expired refresh token", 401);
    }
};

exports.logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
        refreshTokensBlacklist.push(refreshToken); // Add token to blacklist
    }

    res.clearCookie("refreshToken"); // Remove the refresh token cookie
    return sendSuccess(res, "Logged out successfully");
};
