const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { setEventBudget } = require('../controllers/eventController');
const {sanitizeFlightBudget, sanitizeTotalBudget, validateEventID} = require("../utils/eventSanitization");

exports.setEventBudget = async (req, res) => {
    try {
        let {eventID, totalBudget, flightBudget} = req.body;
        if (!eventID, !totalBudget, !flightBudget) return sendError(res, "missing inputs", 400);
        //sanitization and validation
        if (!validateEventID(eventID)) return sendError(res, "invalid EventID", 400);
        totalBudget = sanitizeTotalBudget(totalBudget);
        if (totalBudget === null) return sendError(res, "invalid budget", 400);
        flightBudget = sanitizeFlightBudget(flightBudget);
        if (flightBudget === null) return sendError(res, "invalid flight budget", 400);

        //run update on the event budget
        const success = await setEventBudget(eventID, totalBudget, flightBudget); 
        if(!success) return sendError(res, "failed to set budget", 400);
        return sendSuccess(res, "successfully updated event budget");
    } catch (error) {
        return sendError(res, "failed to updated event budget", 400);
    }

};