const jwt = require('jsonwebtoken');
const { User, UserOrganization, Organization } = require('../models');
const { sendError } = require('../utils/responseHelpers');

//function checks if the user running the function exists and is a part of the organization
exports.checkOrganizationUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user login info from UserLogin table
        const user = await User.findByPk(decoded.id);
        if (!user) return sendError(res, "User not found", 404);
        const userOrganization = await UserOrganization.findByPk(decoded.id);
        if (!userOrganization) return sendError(res, "User not found in any organization", 404);
        if (userOrganization.OrganizationID !== decoded.OrganizationID) return sendError(res, "User not in organization", 401);

        next(); // Move to the next function in the route handler
    } catch (err) {
        console.error(err);
        return sendError(res, "Not authorized, token failed", 401);
    }
};

//checks a passed in userID and organization and make sure that the user exists in the organization
exports.checkUserInOrganization = async (req, res, next) => {
    try {
        const { userID } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const organizationID = parseInt(decoded.OrganizationID); //getting org ID from token

        const user = await UserOrganization.findOne({ where: { UserID: userID, OrganizationID: organizationID } });
        if (!user) return sendError(res, "User not found in organization", 400);
        next();
    } catch (err) {
        console.error(err);
        return sendError(res, "user not in organization", 401);
    }
};

//makes sure user doesn't exist in an organization
exports.checkUserNotInOrganizaiton = async (req, res, next) => {
    try {
        console.log("checkUserIsNotInOrganization");
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return sendError(res, "Not authorized, token missing", 401);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user login info from UserLogin table
        const user = await UserOrganization.findByPk(parseInt(decoded.id));
        if (!user) {
        } else {
            return sendError(res, "User is in organization", 400);
        }
        next();
    } catch (error) {
        console.error(err);
        return sendError(res, "user not in organization", 401);
    }
};