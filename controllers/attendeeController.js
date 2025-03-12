const { Attendee, Invitation, User, Event } = require("../models");
const { Op } = require("sequelize");
const {sendInvitation, sendAccountSetupEmail} = require("../utils/emailSender");
const crypto = require("crypto");


/**
 * Invite an attendee by email for a given event.
 * Checks if the email exists in the system, creates a pending invitation,
 * and sends an invitation link (or account creation link) via email.
 */
exports.inviteAttendee = async (eventId, email) => {
  // Check if user exists (case-insensitive search)
  const user = await User.findOne({ where: { Email: { [Op.iLike]: email } } });
  
  // Prepare invitation data
  const invitationData = {
    EventID: eventId,
    invitedEmail: email,
    status: "pending",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Expires in 48h
    token: crypto.randomBytes(16).toString("hex"),
  };
  if (user) {
    // Record the user ID, but do not expose it later
    invitationData.UserID = user.UserID;
  }
  
  // Create the invitation record
  const invitation = await Invitation.create(invitationData);
  
  // Generate the invitation link based on user existence
  let invitationLink;
  if (user) {
    // Link for existing user to accept the invitation
    invitationLink = `https://example.com/invitation/accept?invitation=${invitation.token}`;
  } else {
    // Link for new user to create an account and accept the invitation
    invitationLink = `https://example.com/invitation/create-account?invitation=${invitation.token}`;
    //Send email too
    await sendAccountSetupEmail(email, invitationLink);
  }
  
  await sendInvitation(email, invitationLink); // It only prints in console for now
  // TODO: Avoid redundancy by sending invitation, email, and message wit a single function

  
  // Return a minimal invitation object (do not expose internal details)
  return {
    invitationId: invitation.InvitationID,
    invitedEmail: invitation.invitedEmail,
    status: invitation.status
  };
};

/**
 * Get accepted attendees and pending invitations for a given event.
 * Returns an object with two arrays: 'attendees' and 'pendingInvitations'.
 * 'attendees': Contains attendee records with user information.
 * 'pendingInvitations': Contains invitation records with minimal details.
 */
exports.getAttendees = async (eventId) => {
  // Retrieve accepted attendees
  const attendees = await Attendee.findAll({
    where: { EventID: eventId },
    include: [
        {model: User, attributes: ["UserID", "FName", "LName", "Email"]},
        {model: Event, attributes: ["EventID", "EventName"]},
    ]
  });
  
  // Retrieve pending invitations
  const pendingInvitations = await Invitation.findAll({
    where: { EventID: eventId, status: "pending" },
    attributes: ["InvitationID", "invitedEmail", "status"]
  });
  
  return {
    attendees,
    pendingInvitations
  };
};
