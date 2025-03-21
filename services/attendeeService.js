const { sendSuccess, sendError } = require("../utils/responseHelpers");
const AttendeeViews = require("../views/attendeeViews");
const userValidation = require("../utils/UserSanitizations");
const AttendeeController = require("../controllers/attendeeController");

/**
 * Invite an attendee by email.
 */
exports.inviteAttendee = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email, eventGroupId } = req.body;
    if (!eventId || !email) {
      return sendError(res, "Event ID and email are required", 400);
    }
    const invitation = await AttendeeController.inviteAttendee(
      eventId,
      email,
      eventGroupId
    );
    return sendSuccess(res, "Invitation sent successfully", { invitation });
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
    const { eventId } = req.params;
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

/**
 * Revokes pending or accepted invitations for an event.
 * Only a planner assigned to the event can revoke invitations.
 */
exports.revokeInvitations = async (req, res) => {
  try {
    const { eventId, emails: invitationIds } = req.body;
    const requesterId = req.user.id; // Authenticated user's ID
    const requesterRoles = req.user.roles; // Must be an Event Planner

    if (
      !eventId ||
      !invitationIds ||
      !Array.isArray(invitationIds) ||
      invitationIds.length === 0
    ) {
      return sendError(res, "Event ID and emails are required", 400);
    }

    const revoked = await AttendeeController.revokeInvitations(
      eventId,
      invitationIds,
      requesterId,
      requesterRoles
    );

    if (!revoked) {
      return sendError(
        res,
        "Not authorized or no matching invitations found",
        403
      );
    }
    return sendSuccess(res, "Invitations removed successfully");
  } catch (error) {
    console.error("Error in revokeInvitations controller: ", error);
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * Cancel the logged-in user's own invitation or attendance.
 */
exports.cancelOwnParticipation = async (req, res) => {
  try {
    const { eventId } = req.body;
    const requesterId = req.user.id;
    if (!eventId) {
      return sendError(res, "Event ID is required", 400);
    }
    const result = await AttendeeController.cancelOwnParticipation(
      eventId,
      requesterId
    );
    if (!result) {
      return sendError(res, "No invitation found or unauthorized", 403);
    }
    return sendSuccess(res, "Invitation canceled successfully", result);
  } catch (error) {
    console.error("Error in cancelOwnInvitation controller:", error);
    return sendError(res, "Internal server error", 500);
  }
};

/**
 * Remove confirmed attendees from an event.
 * Only an event planner who is authorized for the event can remove confirmed attendees.
 */
exports.removeConfirmedAttendees = async (req, res) => {
  try {
    const { eventId, userIds } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    if (
      !eventId ||
      !userIds ||
      !Array.isArray(userIds) ||
      userIds.length === 0
    ) {
      return sendError(
        res,
        400,
        "Event ID and at least one userId are required"
      );
    }
    const removed = await AttendeeController.removeConfirmedAttendees(
      eventId,
      userIds,
      requesterId,
      requesterRole
    );
    if (!removed) {
      return sendError(
        res,
        "Not authorized to remove these attendees or none found",
        403
      );
    }
    return sendSuccess(res, "Attendees removed successfully", { removed });
  } catch (error) {
    console.error("Error in removeConfirmedAttendees controller:", error);
    return sendError(res, "Internal server error", 500);
  }
};


exports.getAttendeeEvents = async (req, res) => {
  try {
    const requesterId = parseInt(req.user.id);
    if (!userValidation.validateUserID(requesterId)) return sendError(res, 'user does not exist', 400);
    let events = await AttendeeViews.getEvents((requesterId));
    if (!events) return sendError(res, 'unable to retrieve events', 400); 

    return sendSuccess(res, 'successfully got events', events);
  } catch (error) {
    return sendError(res, 'failed to get events');
  }
};