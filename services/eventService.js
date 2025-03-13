const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const { createEvent, getEventTypes } = require("../controllers/eventController");
const { sanitizeEventName, sanitizeEventDescription, sanitizeDate, sanitizeTotalBudget, sanitizeFlightBudget, validateEventID} = require("../utils/eventSanitization");
const { validateUserID } = require("../utils/UserSanitizations");
const { validateEventType} = require("../utils/eventTypeSantization");
const EventController = require("../controllers/eventController");
const jwt = require('jsonwebtoken');

exports.createEvent = async (req, res) => {
    try {
        let {name, startDate, endDate, description, typeID} = req.body;
        //make sure required inputs have been sent
        if(!name || !startDate || !endDate || !typeID) return sendError(res, "missing required inputs");
        //pull organizationID and userID from token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = parseInt(decoded.id);
        const organizationID = parseInt(decoded.OrganizationID);

        //sanitization and validation
        if (!validateUserID(userID)) {return sendError(res, "User does not exist", 404);}
        if (!validateOrganizationID(organizationID)) return sendError(res, "Organization does not exist", 404);
        name = sanitizeEventName(name);
        if (name === null) return sendError(res, "event Name is invalid", 400);
        startDate = sanitizeDate(startDate);
        if (startDate === null) return sendError(res, "invalid start date", 400);
        endDate = sanitizeDate(endDate);
        if (endDate === null) return sendError(res, "invalid start date", 400);
        
        if(!description){
            description = '';
        }else if (!sanitizeEventDescription(description) === null) return sendError(res, "invalid description", 400);
        if (!(await validateEventType(typeID, organizationID))) return sendError(res, "event type not found", 404)
        //run function to create user
        const eventID = await createEvent(userID, name, startDate, endDate, description, typeID, organizationID );
        if (!eventID) return sendError(req, "failed to create event", 404);
        // return eventID to user on success
        return sendSuccess(res, "User registered successfully", eventID);
    } catch (err) {
        return sendError(res, "server error");
    }
}


exports.joinEventFinance =  async (req, res) => { //consider making the function call addEventFinance instead
    try {
        let {user, eventID,} = req.body;
        if(!user || !eventID) return sendError(res, "missing inputs");
        //validation
        if (!validateUserID(user.id)) return sendError(res, "invalid userID", 400);
        if (!validateEventID(eventID)) return sendError(res, "invalid eventID", 400);
        //checking if user is already in event staff to see which function needs to be run
        let succes;
        if(EventController.getEventStaff(userID, eventID).length === 0){// if not in eventStaff add the user to the eventStaff
            success = await EventController.addToEventStaff(userID, eventID, 'F');
        }else{//else append the role to the entry
            succes = await EventController.appendRoleToEventStaff(userID, eventID, 'F');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(req, "successfully added user to event staff as a finance user");

    } catch (error) {
        return sendError(req, "server error, unable to add user to eventstaff")
    }

};

exports.addEventFinance =  async (req, res) => {
    try {
        let {userID, eventID,} = req.body;
        if(!userID || !eventID) return sendError(res, "missing inputs");
        //validation
        if (!validateUserID(userID)) return sendError(res, "invalid userID", 400);
        if (!validateEventID(eventID)) return sendError(res, "invalid eventID", 400);
        //run function
        let success;
        if(EventController.getEventStaff(userID, eventID).length === 0){// if not in eventStaff add the user to the eventStaff
            success = await EventController.addToEventStaff(userID, eventID, 'F');
        }else{//else append the role to the entry
            success = await EventController.appendRoleToEventStaff(userID, eventID, 'F');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(req, "successfully added user to event staff as a finance user");

    } catch (error) {
        return sendError(req, "server error, unable to add user to eventstaff")
    }
}


exports.addEventPlanner =  async (req, res) => {
    try {
        let {userID, eventID,} = req.body;
        if(!userID || !eventID) return sendError(res, "missing inputs");
        //validation
        if (!validateUserID(userID)) return sendError(res, "invalid userID", 400);
        if (!validateEventID(eventID)) return sendError(res, "invalid eventID", 400);
        //run function
        let success;
        if(EventController.getEventStaff(userID, eventID).length === 0){// if not in eventStaff add the user to the eventStaff
            success = await EventController.addToEventStaff(userID, eventID, 'E');
        }else{//else append the role to the entry
            success = await EventController.appendRoleToEventStaff(userID, eventID, 'E');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(req, "successfully added user to event staff as a finance user");

    } catch (error) {
        return sendError(req, "server error, unable to add user to eventstaff")
    }
}

/*
Get Methods
*/

//this function returns to a user every event type that is available to their organization
exports.getAvailableEventTypes = async (req, res) =>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const organizationID = parseInt(decoded.OrganizationID);
        //validation
        if (!validateOrganizationID(organizationID)) return sendError(res, "Organization does not exist", 404);

        const eventTypes = await getEventTypes(organizationID);
        if (!eventTypes) return sendError(res, "failed to get event types", 400);

        return sendSuccess(res, "successfully got event types", eventTypes);
    } catch (error) {
        return sendError(res, "server error");
    }

}

exports.getAttendees = async (req, res) => {
    try {
        const {eventId} = req.params;
        if (!eventId) {
            return sendError(res, "Event ID is required", 400);
        }

        const attendees = await EventController.getAttendees(eventId);
        return sendSuccess(res, attendees, "Attendees fetched successfully");
    } catch (error) {
        return sendError(res, error.message, 500);
    }
};

exports.getEventPlanners = async (req, res) => {
    try {
        const {eventId} = req.params;
        if (!eventId) {
            return sendError(res, "Event ID is required", 400);
        }
        const planners = await EventController.getEventStaffByRole(
            eventId,
            "E"
        );
        return sendSuccess(res, "Event planners fetched successfully", {
            planners,
        });
    } catch (error) {
        console.error(error);
        return sendError(res, "Could not fetch event planners", 500);
    }
};

exports.getFinanceUsers = async (req, res) => {
    try {
        const {eventId} = req.params;
        if (!eventId) {
            return sendError(res, "Event ID is required", 400);
        }
        const financeUsers = await EventController.getEventStaffByRole(
            eventId,
            "F"
        );
        return sendSuccess(res, "Finance users fetched successfully", {
            financeUsers,
        });
    } catch (error) {
        console.error(error);
        return sendError(res, "Could not fetch finance users", 500);
    }
};
