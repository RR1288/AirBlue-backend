const jwt = require('jsonwebtoken');
const {User, UserOrganization, Organization} = require('../models');
const { sendError } = require('../utils/responseHelpers');

//function checks if the user exists and is a part of the organization
exports.checkOrganizationUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return sendError(res, "Not authorized, token missing", 401);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user login info from UserLogin table
        const user = await User.findByPk(decoded.id);
        if (!user) return sendError(res, "User not found", 404);
        const userOrganization = await UserOrganization.findByPk(decoded.id);
        console.log(userOrganization);
        console.log(decoded.organizationID);
        if (!userOrganization) return sendError(res, "User not found in any organization", 404);
        if (userOrganization.OrganizationID !== decoded.organizationID) return sendError(res, "User not in organization", 401);
        
        next(); // Move to the next function in the route handler
    } catch (err) {
        console.error(err);
        return sendError(res, "Not authorized, token failed", 401);
    }
};