const {sendSuccess, sendError} = require("../utils/responseHelpers");
const AttendeeController = require("../controllers/attendeeController");

/**
 * Invite an attendee by email.
 */
exports.inviteAttendee = async (req, res) => {
    try {
        const {eventId} = req.params;
        const {email, eventGroupId} = req.body;
        if (!eventId || !email) {
            return sendError(res, "Event ID and email are required", 400);
        }
        const invitation = await AttendeeController.inviteAttendee(
            eventId,
            email,
            eventGroupId
        );
        return sendSuccess(res, "Invitation sent successfully", {invitation});
    } catch (error) {
        console.error(error);
        return sendError(res, "Could not send invitation", 500);
    }
};

/**
 * Get accepted attendees and pending invitations for an event.
 */
exports.getAttendees = async (req, res) => {
    try {
        const {eventId} = req.params;
        if (!eventId) {
            return sendError(res, "Event ID is required");
        }
        const result = await AttendeeController.getAttendees(eventId);
        return sendSuccess(
            res,
            "Attendees and pending invitations fetched successfully",
            result
        );
    } catch (error) {
        console.error(error);
        return sendError(res, "Could not get attendees", 500);
    }
};

exports.removeAttendee = async (req, res) => {
    try {
        const {eventId, userId} = req.body;        
        const requesterId = req.user.id; // Authenticated user's ID
        const requesterRoles = req.user.roles; // Must be an Event Planner 

        if (!eventId) {
            return sendError(res, "Event ID is required", 400);
        }

        // If userId is omitted, assume requester wants to cancel their own attendance.
        const targetUserId = userId || requesterId;

        const success = await AttendeeController.removeAttendee(
            eventId,
            targetUserId,
            requesterId,
            requesterRoles,
        );

        if (!success) {
            return sendError(
                res,
                "Not authorized to remove this attendee or attendee not found",
                403
            );
        }
        return sendSuccess(res, "Attendee removed successfully");
    } catch (error) {
        console.error("Error in controller:", error);
        return sendError(res, "Internal server error", 500);
    }
};
