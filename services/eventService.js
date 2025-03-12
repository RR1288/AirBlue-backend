const {sendSuccess, sendError} = require("../utils/responseHelpers");
const EventController = require("../controllers/eventController");

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

        const result = await EventController.processInvitationAcceptance(invitation);

        if (!result) {
            return sendError(res, "Invalid or expired invitation", 400);
        }

        return sendSuccess(res, "Invitation accepted successfully");
    } catch (error) {
        console.error(error);
        return sendError(res, "Internal server error", 500);
    }
};
