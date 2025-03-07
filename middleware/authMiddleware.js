const jwt = require('jsonwebtoken');
const {User, UserLogin} = require('../models');
const { sendError } = require('../utils/responseHelpers');

// Protect with JWT token
exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return sendError(res, "Not authorized, token missing", 401);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Fetch user login info from UserLogin table
        const user = await UserLogin.findByPk(decoded.id);
        if (!user) return sendError(res, "User not found", 404);

        user.roles = decoded.roles; // Attach roles to user
        user.username = decoded.username;   // Attach username to user
        req.user = user; // Attach user to request
        
        next(); // Move to the next function in the route handler
    } catch (err) {
        console.error(err);
        return sendError(res, "Not authorized, token failed", 401);
    }
};

