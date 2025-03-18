const { sendSuccess, sendError } = require("../utils/responseHelpers");
const AttendeeController = require("../controllers/attendeeController");
const {sanitizeEmail} = require("../utils/UserSanitizations");
const {validateEventID} = require("../utils/eventSanitization");
const {deleteCSV, processCSV} = require("../utils/csvReader");
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
    const invitation = await AttendeeController.inviteAttendee(eventId, email, eventGroupId);
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
  try {
    //declare passed in values
    if (! req.path) return sendError(res, "no file given", 400);
    const {eventId, eventGroupId} = req.body;
    //decalare the csv path here
    let filepath = req.file.path;
    //validation
    if (!validateEventID(eventId)) return sendError(res, "invalid eventId", 400);
    if (false) return sendError(res, "invalid eventGroupId");

    //converts the csv input into a list of basic user informaiton
    let csvItems = processCSV(filepath);
    let successfulInvites = 0;
    let failedInvites = 0;
    //loop through the preivously created list to 
    for (let i = 0; i < csvItems.length; i++) {
      try {
        //check if the email is missing or invalid
        let email = sanitizeEmail(csvItems[i].email);
        //if it is missing add the entry to the failed entries list and continue
        if(!email || email === null){
          //add the object to the list of failedInvites
          failedInvites += 1;
          csvItems[i].success = false;
          continue;
        }else{ //else pass the email in to inviteAttendee function
          const invitation = await AttendeeController.inviteAttendee(eventId, email, eventGroupId);
          successfulInvites += 1;
          csvItems[i].success = true;
        }


      } catch (error) {// if a failure happens and the code errors out just add the entry to the list of failed adds
        failedInvites += 1;
        csvItems[i].success = false;
      }
    }
    //if no errors have occured combine the succesfulInvites and failedInvites into on object and send succeess
    let combinedSuccessFailed
    return sendSuccess(res, "successfully ran function with "+successfulInvites+" users successfully invited and "+failedInvites+" failed invites");
  } catch (error) {
    //return the process as a failer
    return sendError(res, "failed to add attendees through input file");
  } finally {
    deleteCSV(filepath);
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
    return sendSuccess(res, "Attendees and pending invitations fetched successfully", result);
  } catch (error) {
    console.error(error);
    return sendError(res, "Could not get attendees", 500);
  }
};
