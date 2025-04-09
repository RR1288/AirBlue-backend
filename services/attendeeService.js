const { sendSuccess, sendError } = require("../utils/responseHelpers");
const AttendeeViews = require("../views/attendeeViews");
const userValidation = require("../utils/UserSanitizations");
const AttendeeController = require("../controllers/attendeeController");
const {sanitizeEmail} = require("../utils/UserSanitizations");
const {validateEventID} = require("../utils/eventSanitization");
const {validateEventGroup} = require("../utils/sanitizeEventGroup");
const {deleteCSV, processCSV} = require("../utils/csvReader");
const {Attendee, Event} = require("../models");
const {checkPlannerAuthorization} = require("../controllers/attendeeController");
const { updateAttendeeEventGroup } = require("../controllers/attendeeController"); 
const {validateToken} = require('../utils/invitationValidation');
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
 * this function takes in a csv/ csv file path runs it through a util to convert it into a list og
 * objects filled with basic information to make a user account. Then it reads through them
 * checks to see if the user exists in the system. If not it will create a basic account and send an email to set the password.
 * Then as long as the user exists now it will send the user an invite to the event
 * 
 * 
 */
exports.inviteAttendeesCsv = async (req, res) => {
  let filepath = req.file.path;
  try {
    //declare passed in values
    if (! filepath ) return sendError(res, "no file given", 400);
    const {eventId, eventGroupId} = req.query;
    if (!eventId || !eventGroupId) return sendError(res, "missing inputs", 400);
    //validation
    if (!validateEventID(eventId)) return sendError(res, "invalid eventId", 400);
    if (!validateEventGroup(eventId, eventGroupId)) return sendError(res, "invalid eventGroupId");

    //converts the csv input into a list of basic user informaiton
    let csvItems = await processCSV(filepath);
    let successfulInvites = 0;
    let failedInvites = 0;
    //loop through the preivously created list to 
    for (let i = 0; i < csvItems.length; i++) {
      try {
        //check if the email is missing or invalid
        let email = sanitizeEmail(csvItems[i].Email);
        //if it is missing add the entry to the failed entries list and continue
        if(!email || email === null){
          //add the object to the list of failedInvites
          failedInvites += 1;
          csvItems[i].success = false;
          continue;
        }else{ //else pass the email in to inviteAttendee function
          const invitation = await AttendeeController.inviteAttendee(parseInt(eventId), email, parseInt(eventGroupId));
          successfulInvites += 1;
          csvItems[i].success = true;
        }


      } catch (error) {// if a failure happens and the code errors out just add the entry to the list of failed adds
        console.log(error);
        failedInvites += 1;
        csvItems[i].success = false;
      }
    }
    //if no errors have occured combine the succesfulInvites and failedInvites into on object and send succeess
    await deleteCSV(filepath);
    return sendSuccess(res, "successfully ran function with "+successfulInvites+" users successfully invited and "+failedInvites+" failed invites", csvItems);
  } catch (error) {
    //return the process as a failer
    await deleteCSV(filepath);
    return sendError(res, "failed to add attendees through input file");
    
  } 
}

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
    const { eventId, invitationIds } = req.body;
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
    const requesterRole = req.user.roles;    
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
    if (!await userValidation.validateUserID(requesterId)) return sendError(res, 'user does not exist', 400);
    let events = await AttendeeViews.getEvents((requesterId));
    if (!events) return sendError(res, 'unable to retrieve events', 400); 

    return sendSuccess(res, 'successfully got events', events);
  } catch (error) {
    return sendError(res, 'failed to get events');
  }
};

exports.getInvitesAttendeee = async(req,res) => {
  try {
    const requesterId = parseInt(req.user.id);
    if (!await userValidation.validateUserID(requesterId)) return sendError(res, 'user does not exist', 400);
    let invites = await AttendeeViews.getInvitesAttendee(requesterId);
    if (!invites) return sendError(res, 'failed to get invites', 400);
    return sendSuccess(res, 'successfully got all invitations', invites);
  } catch (error) {
    return sendError(res, 'failed to get invites');
  }
};

exports.updateTokenOnCreation = async (req, res) => {
  try {
    const {token} = req.body;
    if (!validateToken(token)) return sendError(res, 'invalid token', 400);
    let success = AttendeeController.updateTokenOnUserCreation(token);
    if (!success) return sendError(res, 'unable to updated invitation', 400);
    return sendSuccess(res, 'successfully updated invitation')
  } catch (error) {
      return sendError(res, 'failed to update invitation');
  }
};

exports.updateAttendeeEventGroup = async (req, res) => {
  try {
      // Destructure the necessary parameters from the request body
      const { attendeeId, eventGroupId } = req.body;

      // Validate required fields
      if (!attendeeId) return sendError(res, "Attendee ID is required", 400);
      if (!eventGroupId) return sendError(res, "Event Group ID is required", 400);

      // Validate that attendeeId and eventGroupId are numbers
      if (isNaN(attendeeId) || attendeeId <= 0) return sendError(res, "Invalid Attendee ID", 400);
      if (isNaN(eventGroupId) || eventGroupId <= 0) return sendError(res, "Invalid Event Group ID", 400);

      // Find the attendee by attendeeId
      const attendee = await Attendee.findByPk(attendeeId);
      if (!attendee) {
          return sendError(res, "Attendee not found", 404);
      }

      // Update the attendee's EventGroupID with the new eventGroupId
      attendee.EventGroupID = eventGroupId;
      await attendee.save(); // Save the changes to the database

      // Return a success response with the updated attendee data
      return sendSuccess(res, "Attendee's event group updated successfully", {
          AttendeeID: attendee.AttendeeID,
          UserID: attendee.UserID,
          EventID: attendee.EventID,
          EventGroupID: attendee.EventGroupID, // Include EventGroupID in the response
          Confirmed: attendee.Confirmed,
          createdAt: attendee.createdAt,
          updatedAt: attendee.updatedAt,
          deletedAt: attendee.deletedAt,
      });

  } catch (err) {
      console.error(err);
      return sendError(res, "Error updating attendee event group.", 500);
  }
};