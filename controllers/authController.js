const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const {User, UserLogin, UserOrganization} = require("../models");
const bcrypt = require("bcryptjs");

const {sendSuccess, sendError} = require("../utils/responseHelpers");

// Generate token
const generateToken = (user) => {
    if (user.UserOrganizations.length > 0) {
        const roles = user.UserOrganizations[0].Roles;
        const organizationID = user.UserOrganizations[0].OrganizationID;
        signature = {
            id: user.UserID,
            username: user.UserName,
            roles: roles,
            OrganizationID: organizationID,
        };
    } else {
        signature = {id: user.UserID, username: user.UserName};
    }

    return jwt.sign(signature, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

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

        // Prepare additional user info to return
        let uRoles = user.UserOrganizations[0];
        console.log(uRoles);
        if (!uRoles) {
            uRoles = '';
        }else {
            uRoles = user.UserOrganizations[0].dataValues.Roles;
        }
        const userInfo = {
            userId: user.UserID,
            username: user.UserName,
            roles: uRoles,
        };
        console.log(userInfo);
        // If 2FA is enabled
        if (user.UserLogin.two_fa_enabled) {
            return sendSuccess(res, "2FA required", {
                two_fa_required: true,
                ...userInfo,
            });
        }

        // Else just generate jwt token
        const token = generateToken(user);
        return sendSuccess(res, "Login successful", {
            token: token,
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

        // Create JWT token
        const jwtToken = generateToken(user);
        return sendSuccess(res, "2FA verification successful", {
            token: jwtToken,
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
