const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const { createEvent, getEventTypes } = require("../controllers/eventController");
const { sanitizeEventName, sanitizeEventDescription, sanitizeDate, sanitizeTotalBudget, sanitizeFlightBudget, validateEventID, sanitizeLocation} = require("../utils/eventSanitization");
const { validateUserID } = require("../utils/UserSanitizations");
const { validateEventType} = require("../utils/eventTypeSantization");
const { sanitizeGroupFlightBudget, sanitizeGroupName} = require("../utils/sanitizeEventGroup");
const EventController = require("../controllers/eventController");
const jwt = require("jsonwebtoken");

exports.createEvent = async (req, res) => {
    try {
        let {name, startDate, endDate, description, typeID, location, maxAttendees} = req.body;
        //make sure required inputs have been sent
        if(!name || !startDate || !endDate || !typeID || !location || !maxAttendees) return sendError(res, "missing required inputs");
        //pull organizationID and userID from token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = parseInt(decoded.id);
        const organizationID = parseInt(decoded.OrganizationID);

        //sanitization and validation
        if (!validateUserID(userID)) {return sendError(res, "User does not exist", 404);}
        if (!validateOrganizationID(organizationID)) return sendError(res, "Organization does not exist", 404);
        if (typeof(maxAttendees) !== "number" || maxAttendees < 0) return sendError(res, "bad value for max attendees", 400);
        location = sanitizeLocation(location);
        if (location === null) return sendError(res, "invalid locaiton", 400);
        name = sanitizeEventName(name);
        if (name === null) return sendError(res, "event Name is invalid", 400);

        startDate = sanitizeDate(startDate);
        if (startDate === null)
            return sendError(res, "invalid start date", 400);

        endDate = sanitizeDate(endDate);
        if (endDate === null) return sendError(res, "invalid start date", 400);

        
        if(!description){
            description = '';
        }else if (!sanitizeEventDescription(description) === null) return sendError(res, "invalid description", 400);
        if (!(await validateEventType(typeID, organizationID))) return sendError(res, "event type not found", 404)
        //run function to create user
        const eventID = await createEvent(userID, name, startDate, endDate, description, typeID, organizationID, location, maxAttendees);
        if (!eventID) return sendError(req, "failed to create event", 404);
        // return eventID to user on success
        return sendSuccess(res, "event created successfully", eventID);
    } catch (err) {
        return sendError(res, "server error");
    }
};


exports.joinEventFinance =  async (req, res) => { //consider making the function call addEventFinance instead
    try {
        let { eventID,} = req.body;
        if(!eventID) return sendError(res, "missing inputs");
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = parseInt(decoded.id);
        //validation
        if (!validateUserID(userID)) return sendError(res, "invalid userID", 400);
        if (!validateEventID(eventID)) return sendError(res, "invalid eventID", 400);
        //checking if user is already in event staff to see which function needs to be run
        let succes;
        let inStaff = await EventController.getEventStaff(userID, eventID);
        if(inStaff.length === 0){// if not in eventStaff add the user to the eventStaff
            success = await EventController.addToEventStaff(userID, eventID, 'F');
        }else{//else append the role to the entry
            success = await EventController.appendRoleToEventStaff(userID, eventID, 'F');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(res, "successfully added user to event staff as a finance user");

    } catch (error) {
        return sendError(res, "server error, unable to add user to eventstaff")
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
        let inStaff = await EventController.getEventStaff(userID, eventID);
        if(inStaff.length === 0){
            success = await EventController.addToEventStaff(userID, eventID, 'F');
        }else{//else append the role to the entry
            success = await EventController.appendRoleToEventStaff(userID, eventID, 'F');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(res, "successfully added user to event staff as a finance user");

    } catch (error) {
        return sendError(res, "server error, unable to add user to eventstaff")
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
        let inStaff = await EventController.getEventStaff(userID, eventID);
        if(inStaff.length === 0){
            success = await EventController.addToEventStaff(userID, eventID, 'E');
        }else{//else append the role to the entry
            success = await EventController.appendRoleToEventStaff(userID, eventID, 'E');
        }
        //make sure that function ran successfully
        if(!success) return sendError(res, "failed to add user to event staff as an event planner", 400);
        return sendSuccess(res, "successfully added user to event staff as a finance user");

    } catch (error) {
        console.log(error)
        return sendError(res, "server error, unable to add user to eventstaff")
    }
}

exports.createEventGroup = async (req, res) => {
    try {
        let {eventID, name, budget} = req.body;
        if (!eventID || !name || !budget) return sendError(res, "missing inputs", 400);
        //validations
        if (!validateEventID(eventID)) return sendError(res, "invalid eventID", 400);
        if (sanitizeGroupFlightBudget(budget) === null) return sendError(res, "invalid flight budget", 400);
        if (sanitizeGroupName(name) === null) return sendError(res, "invalidname for the group", 400);
        //run main function
        let success = EventController.createEventGroup(eventID, name, budget);
        if (!success) return sendError(res, "EventGroup creation failed", 400);
        return sendSuccess(res, "event group successfully created");
    } catch (error) {
        console.log(error);
        return sendError(res, "failed to create EventGroup");
    }
};
/*
Get Methods
*/

//this function returns to a user every event type that is available to their organization
exports.getAvailableEventTypes = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const organizationID = parseInt(decoded.OrganizationID);
        //validation
        if (!validateOrganizationID(organizationID))
            return sendError(res, "Organization does not exist", 404);

        const eventTypes = await getEventTypes(organizationID);
        if (!eventTypes)
            return sendError(res, "failed to get event types", 400);

        return sendSuccess(res, "successfully got event types", eventTypes);
    } catch (error) {
        return sendError(res, "server error");
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

exports.acceptInvitation = async (req, res) => {
    try {
        const {invitation} = req.query;

        if (!invitation) {
            return sendError(res, "Invitation token is required", 400);
        }

        const result = await EventController.processInvitationAcceptance(
            invitation
        );

        if (!result) {
            return sendError(res, "Invalid or expired invitation", 400);
        }

        return sendSuccess(res, "Invitation accepted successfully");
    } catch (error) {
        //console.error(error);
        return sendError(res, "Internal server error", 500);
    }
};

exports.updateEvent = async (req, res) => {
    try {
        let { eventID, EventName, startDate, endDate, description, location, maxAttendees } = req.body;

        // Validate required fields (we assume eventID is required for updating)
        if (!eventID) return sendError(res, "Event ID is required", 400);

        // Initialize an empty object to hold the updates
        const updates = {};

        // Validate and sanitize eventName
        if (EventName) {
            EventName = sanitizeEventName(EventName);
            if (EventName === null) return sendError(res, "Invalid event name", 400);
            updates.EventName = EventName;
        }

        // Validate and sanitize startDate and endDate
        if (startDate) {
            startDate = sanitizeDate(startDate);
            if (startDate === null) return sendError(res, "Invalid start date", 400);
            updates.EventStartDate = startDate;
        }

        if (endDate) {
            endDate = sanitizeDate(endDate);
            if (endDate === null) return sendError(res, "Invalid end date", 400);
            updates.EventEndDate = endDate;
        }

        // Validate and sanitize location
        if (location) {
            location = sanitizeLocation(location);
            if (location === null) return sendError(res, "Invalid location", 400);
            updates.Location = location;
        }

        // Validate and sanitize description (optional)
        if (description) {
            description = sanitizeEventDescription(description);
            if (description === null) return sendError(res, "Invalid description", 400);
            updates.EventDescription = description;
        }

        // Validate maxAttendees (optional)
        if (maxAttendees !== undefined) {
            if (typeof(maxAttendees) !== "number" || maxAttendees < 0) return sendError(res, "Invalid value for max attendees", 400);
            updates.MaxAttendees = maxAttendees;
        }

        // Call the controller to update the event
        const updatedEvent = await EventController.updateEvent(eventID, updates);

        return sendSuccess(res, "Event updated successfully", updatedEvent);
    } catch (err) {
        console.error(err);
        return sendError(res, "Server error, unable to update event", 500);
    }
};

exports.updateEventGroup = async (req, res) => {
    try {
        let { eventGroupID, name, budget } = req.body;

        // Ensure at least one update field is provided
        if (!eventGroupID) return sendError(res, "Event Group ID is required", 400);

        // Validate the inputs
        if (name && sanitizeGroupName(name) === null) {
            return sendError(res, "Invalid event group name", 400);
        }
        if (budget && sanitizeGroupFlightBudget(budget) === null) {
            return sendError(res, "Invalid flight budget", 400);
        }

        // Create the updates object
        const updates = {};
        if (name) updates.Name = name;
        if (budget) updates.FlightBudget = budget;

        // Call the controller to update the event group
        const updatedEventGroup = await EventController.updateEventGroup(eventGroupID, updates);
        
        return sendSuccess(res, "Event group updated successfully", updatedEventGroup);
    } catch (error) {
        console.error(error);
        return sendError(res, "Server error, unable to update event group", 500);
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { eventID } = req.body;

        // Validate event ID
        if (!eventID) {
            return sendError(res, "Event ID is required", 400);
        }

        if (!validateEventID(eventID)) {
            return sendError(res, "Invalid event ID", 400);
        }

        // Call the deleteEvent function from eventController
        const result = await EventController.deleteEvent(eventID);
        
        if (result) {
            return sendSuccess(res, "Event deleted successfully");
        } else {
            return sendError(res, "Failed to delete event", 500);
        }
    } catch (error) {
        console.error(error);
        return sendError(res, "Server error", 500);
    }
};