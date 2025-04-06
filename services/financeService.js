const { sendSuccess, sendError } = require('../utils/responseHelpers');
const { setEventBudget } = require('../controllers/eventController');
const FinanceViews = require('../views/financeViews');
const { validateUserID } = require("../utils/UserSanitizations");
const { validateOrganizationID } = require("../utils/OrganizationSanitization");
const {sanitizeFlightBudget, sanitizeTotalBudget, validateEventID, sanitizeThresholdValuePercent} = require("../utils/eventSanitization");
const jwt = require("jsonwebtoken");
exports.setEventBudget = async (req, res) => {
    try {
        let {eventID, totalBudget, flightBudget, thresholdVal} = req.body;
        if (!eventID, !totalBudget, !flightBudget) return sendError(res, "missing inputs", 400);
        //sanitization and validation
        if (!validateEventID(eventID)) return sendError(res, "invalid EventID", 400);
        totalBudget = sanitizeTotalBudget(totalBudget);
        if (totalBudget === null) return sendError(res, "invalid budget", 400);
        flightBudget = sanitizeFlightBudget(flightBudget);
        if (flightBudget === null) return sendError(res, "invalid flight budget", 400);

        //threshold Validation
        //I am jus doing i by percenage for now
        if (!thresholdVal){
            thresholdVal = 0;
        }else{//TODO: make sure that this can handle flat values
            thresholdVal = sanitizeThresholdValuePercent(thresholdVal);
            console.log(thresholdVal);
            if(thresholdVal === null) return sendError(res, "invalid threshold Value", 400);
        }

        //run update on the event budget
        const success = await setEventBudget(eventID, totalBudget, flightBudget, thresholdVal); 
        if(!success) return sendError(res, "failed to set budget", 400);
        return sendSuccess(res, "successfully updated event budget");
    } catch (error) {
        return sendError(res, "failed to updated event budget", 400);
    }

};

exports.getAllEventsFinance = async (req, res) => {
    try {
        //declare userID and organizationID for use
        //TODO check on the protect and how to pull values from it
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = parseInt(decoded.id);
        const organizationID = parseInt(decoded.OrganizationID);
        //validations
        if (!validateUserID(userID)) {return sendError(res, "User does not exist", 404);}
        if (!validateOrganizationID(organizationID)) return sendError(res, "Organization does not exist", 404);

        //run primary functions in the view
        let eventsUserIsIn = await FinanceViews.getEventsFinance(organizationID, userID);
        let eventsJoinable = await FinanceViews.getJoinableEventsFinance(organizationID);
        if (!eventsUserIsIn) return sendError(res, 'failed to get events the user is in', 400);
        if (!eventsJoinable) return sendError(res, 'failed to get joinable events', 400);
        let combined = [...eventsUserIsIn, ...eventsJoinable];
        return sendSuccess(res, "successfully got events", combined);

    } catch (error) {
        console.log(error);
        return sendError(res, 'failed to get events', 400);
    }
};

exports.getEventBudgetReport = async (req, res) => {
    try {
       //get eventID from function call
       let {eventID} = req.params;
       //validation
        if (!(await validateEventID(eventID))) return sendError(res, 'invalid eventID', 400);
       //run function
       let report = await FinanceViews.getEventFlightReport(eventID);
       if (!report) return sendError(res, 'failed to get budget report', 400);
       return report;
    } catch (error) {
        return sendError(res, 'failed to get budget report');
    }
}