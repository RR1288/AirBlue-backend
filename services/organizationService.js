const {sendSuccess, sendError} = require("../utils/responseHelpers");
const OrganizationViews = require('../views/organizationViews');
const {validateOrganizationID} = require('../utils/OrganizationSanitization');

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