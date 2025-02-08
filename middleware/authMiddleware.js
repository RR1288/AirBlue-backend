const jwt = require('jsonwebtoken');
const {User, UserLogin} = require('../models');

// Protect with JWT token
exports.protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(" ")[1];    // Get token
    }
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) throw new Error("Not authorized, user not found");
        req.user = user;

        next(); //TODO: what does it do?
        
    } catch (err) {
        console.error(err);
        throw new Error("Not authorized, token failed");
    }
};
