const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const [ createEvent ] = require("../controllers/eventController");
const { sanitizeEventName, sanitizeEventDescription, sanitizeDate, sanitizeTotalBudget, sanitizeFlightBudget} = require("../utils/eventSanitization")

exports.createEvent = async (req, res) => {
    try {
        let {name, startDate, endDate, description, typeID} = req.body;
        //make sure required inputs have been sent
        if(!name, !startDate, !endDate, !typeID) return sendError(res, "missing required inputs");
        //pull organizationID and userID from token
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = parseInt(decoded.id);
        const organizationID = parseInt(decoded.OrganizationID);

        //sanitization and validation
        if (!validateUserID(userID)) {return sendError(res, "User does not exist", 400);}
        if (!validateOrganizationID(organizationID)) return sendError(res, "Organization does not exist", 400);
        if (!sanitizeEventName(name) === null) return sendError(res, "eventName invalid", 400);
        if (!sanitizeDate(startDate) === null) return sendError(res, "invalid start date", 400);
        if (!sanitizeDate(endDate) === null) return sendError(res, "invalid start date", 400);
        
        if(!description){
            description = '';
        }else if (!sanitizeEventDescription(description) === null) return sendError(res, "invalid description", 400);

        //run function to create user
        const eventID = await createEvent(userID, name, startDate, endDate, description, typeID, organizationID );
        if (!eventID) return sendError(req, "failed to create event", 404);
        // return eventID to user on success
        return sendSuccess(res, "User registered successfully", eventID);
    } catch (err) {
        return sendError(res, "server error");
    }
}