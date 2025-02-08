const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const {User} = require("../models");
const bcrypt = require("bcryptjs");

const {sendSuccess, sendError} = require("../utils/responseHelpers");

// Generate token
const generateToken = (user) => {
    return jwt.sign(
        {id: user.id, email: user.email, roles: user.roles},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
    );
};

// Register
exports.register = async (req, res) => {
    try {
        // Get username, password and roles
        const {username, password, roles} = req.body;

        // Send an error if no username or password is provided
        if (!username || !password) {
            sendError(res, "Username and password required", 400);
        }

        // Throw an error if user already exists
        const existingUser = await User.findOne({where: {username}});
        if (existingUser) {
            sendError(res, "User already exists", 400);
        }

        //===================START TRANSACTION======================
        // Create user
        const user = User.create({
            // Get from body
            UserName: username,
            FName: firstname,
            LName: lastname,
            City: city,
            State: state,
            Country: country,
            Email: email,
            KTN: ktn,
            CreationDate: Date.now(),
            LastEdited: Date.now(),
        });

        // Create UserLogin entry
        const userLogin = userLogin.create({
            UserID: user.id,
            Password: password,
            two_fa_enabled: false, //TODO: add to table
            two_fa_secret: null, //TODO: add to table
            //MFATarget
            LastPasswordChange: Date.now(),
            LastMFAChange: null,
        });

        // Assign an organization to it

        //===================END TRANSACTION======================
        // automatic rollback if an error occurs?
        sendSuccess(res, "User registered", {userId: user.id});
    } catch (err) {
        console.error(err);
        sendError(res, "Error registering user", 500);
    }
};

// Login
exports.login = async (req, res) => {
    try {
        // Get username and password
        const {username, password} = req.body;
        // Find user
        const user = User.findOne({where: {username}});
        if (!user) sendError(res, "Invalid credentials", 400);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) sendError(res, "Invalid credentials", 400);

        // If 2FA is enabled
        if (user.two_fa_enabled) {
            sendSuccess(res, "2FA required", {
                two_fa_required: true,
                userId: user.id,
            });
        }

        // Else just generate jwt token
        const token = generateToken(user);
        sendSuccess(res, "Login successful", {token: token});
    } catch (err) {
        console.error(err);
        sendError(res, "Server error", 500);
    }
};

// setup2FA
exports.setup2FA = async (req, res) => {
    try {
        const user = req.user;

        // Generate TOTP secret
        const secret = speakeasy.generateSecret({
            name: `AirBlue (${user.username})`,
            length: 20, //Common length
        });

        // Update secret
        user.two_fa_secret = secret.base32;
        user.two_fa_enabled = true;

        // Save
        await user.save();

        // Generate QR code
        const otpAuthURL = secret.otpauth_url;
        const qrCodeDataURL = qrcode.toDataURL(otpAuthURL);

        sendSuccess(res, "2FA setup successful", {qrCode: qrCodeDataURL});
    } catch (err) {
        console.error(err);
        sendError(res, "Failed to setup 2FA", 500);
    }
};

// verify2FA
exports.verify2FA = async (req, res) => {
    try {
        // Get token from body
        const {token} = req.body;
        // Get user
        const user = req.user;

        // If 2FA is not enabled
        if (!user.two_fa_enabled || !user.two_fa_secret) {
            sendError(res, "2FA is not enabled for this user", 4);
        }

        // Verify token using speakeasy
        const verified = speakeasy.totp.verify({
            secret: user.two_fa_secret,
            encoding: "base32",
            token: token,
            window: 1, // 1 minute or more?
        });

        if (!verified) sendError(res, "Invalid 2FA token", 400);

        // Create JWT token
        const jwtToken = generateToken(user);
        sendSuccess(res, "2FA verification successful", {token: jwtToken});
    } catch (err) {
        console.error(err);
        sendError(res, "Failed to verify 2FA token", 500);
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
        sendSuccess(res, "2FA disabled successfully");
    } catch (err) {
        console.error(err);
        sendError(res, "Failed to disable 2FA", 500);
    }
};