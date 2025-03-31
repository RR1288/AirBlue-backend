const {sendSuccess, sendError} = require("../utils/responseHelpers");
const OrganizationViews = require('../views/organizationViews');
const organizationControllor = require('../controllers/organizationControllor');
const {validateOrganizationID, sanitizeOrganizationName, sanitizeOrganizationDescription} = require('../utils/OrganizationSanitization');
const {validateUserID} = require('../utils/UserSanitizations');


exports.createOrganization = async (req, res) => {
    try {
        let requesterId = req.user.id;
        let {name, description} = req.body;

        //validation here
        if (!(await validateUserID(requesterId))) return sendError(res, 'invalid user', 400);
        if (sanitizeOrganizationName(name) === null) return sendError(res, 'invalid name', 400);
        if (sanitizeOrganizationDescription(description) === null) return sendError(res, 'invalid description', 400);
        //run function
        const success =  await organizationControllor.createOrganization(name, description, requesterId);
        if (!success) return sendError(res, 'failed to create organization', 400);
        return sendSuccess(res, 'successfully create organization');
    } catch (error) {
        return sendError(res, 'failed to create organizaiton')
    }
};


exports.getOrganizationUsers = async (req, res) =>{
    try {
        let organizationId = parseInt(req.user.OrganizationID);
        //validation
        if (!(await validateOrganizationID(organizationId))) return sendError(res, 'invalid organizationId', 400);
        //run function
        const users = await OrganizationViews.getOrganizationUsers(organizationId);
        if (!users) return sendError(res, 'failed to get organization Users', 400);
        //return on success
        return sendSuccess(res, 'successfully retrieved organization users', users);
    } catch (error) {
        console.log(error);
        return sendError(res, 'failed to get organization Users');
    }
};

exports.getOrganizationInfo = async (req, res) =>{
    try {
        let organizationId = parseInt(req.user.OrganizationID);
        //validation
        if (!(await validateOrganizationID(organizationId))) return sendError(res, 'invalid organizationId', 400);
        //run function
        const users = await OrganizationViews.getOrganizationInfo(organizationId);
        if (!users) return sendError(res, 'failed to get organization info', 400);
        //return on success
        return sendSuccess(res, 'successfully retrieved organization info', users);
    } catch (error) {
        return sendError(res, 'failed to get organization info');
    }
};