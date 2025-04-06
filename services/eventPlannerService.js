const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { getAllEventPlanners } = require('../controllers/userController');
const eventPlannerViews = require("../views/eventPlannerViews");
const {validateUserID} = require('../utils/UserSanitizations');
const {validateOrganizationID} = require('../utils/OrganizationSanitization');
const {validateEventID} = require('../utils/eventSanitization');

exports.getAllEventPlanners = async (req, res) => {
    try {
         
        const eventPlanners = await getAllEventPlanners();
        if (!eventPlanners || eventPlanners.length === 0) {
            return sendError(res, 'No event planners found', 404);
        }
        return sendSuccess(res, 'All event planners retrieved successfully', {eventPlanners});
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching event planners');
    }
};
exports.getAttendees = async (req, res) => {
    try {
        const {eventId} = req.query;
        let eventID = parseInt(eventId);
        if(!(await validateEventID(eventID))) return sendError(res, 'invalid eventId', 400); //check to make sure that this isn't an await

        //run the function
        const attendees = await eventPlannerViews.getAttendees(eventID);
        if(!attendees) return sendError(res, 'failed to get attendees', 400);
        return sendSuccess(res, "successfully retrieved attendees", attendees);
    } catch (error) {
        return sendError(res, 'failed to retrieve attendees', 400);
    }
};

exports.getAttendeesForApproval = async (req, res) => {
    try {
        let userID = parseInt(req.user.id);
        if(!(await validateUserID(userID))) return sendError(res, 'invalid userId', 400); //check to make sure that this isn't an await

        //run the function
        const attendees = await eventPlannerViews.getAttendeesForApproval(userID);
        if(!attendees) return sendError(res, 'failed to get attendees', 400);
        return sendSuccess(res, "successfully retrieved attendees", attendees);
    } catch (error) {
        console.log(error);
        return sendError(res, 'failed to retrieve attendees', 400);
    }
};

exports.getInvitees = async (req, res) => {
    try {
        const {eventId} = req.query;
        let eventID = parseInt(eventId);
        if(!(await validateEventID(eventID))) return sendError(res, 'invalid eventId', 400); //check to make sure that this isn't an await

        //run the function
        const invitees = await eventPlannerViews.getInvitees(eventID);
        if(!invitees) return  sendError(res, 'failed to get invitees', 400);
        return sendSuccess(res, "successfully retrieved Invitees", invitees);
    } catch (error) {
        return sendError(res, 'failed to retrieve Invitees', 400);
    }
};
exports.getAllEventsPlanner = async (req, res) => {
    try {
        const requesterId = parseInt(req.user.id);
        const requesterOrg = parseInt(req.user.OrganizationID);
        //validation
        if (!validateUserID(requesterId)) return sendError(res, 'invalid userID', 400);
        if (!validateOrganizationID(requesterOrg)) return sendError(res, 'invalid Organization ID', 400);
        //run function
        const events = await eventPlannerViews.getEventsPlanner(requesterOrg , requesterId);
        if (!events || events.length === 0) {
            return sendError(res, 'No event found', 404);
        }
        return sendSuccess(res, 'All events retrieved successfully', events);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Something went wrong while fetching event planners');
    }
};

exports.getEventReportPlanner = async (req, res) => {
    try {
        let {eventID} = req.params;
        eventID = parseInt(eventID);
        if(!(await validateEventID(eventID))) return sendError(res, 'invalid eventID', 400);

        let report = await eventPlannerViews.getEventReportPlanner(eventID);
        if(!report) return sendError(res, 'failed to get report', 400);
        return sendSuccess(res, 'successfully got event report', report);
    } catch (error) {
        console.log(error);
        return sendError(res, 'failed to get report');
    }
};