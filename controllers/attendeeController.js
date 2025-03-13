const {Attendee, Invitation, User, Event, EventStaff} = require("../models");
const {Op} = require("sequelize");
const { Sequelize } = require("sequelize");
const {sendInvitation, sendAccountSetupEmail} = require("../utils/emailSender");
const {Roles} = require("../utils/Roles");
const crypto = require("crypto");

/**
 * Invite an attendee by email for a given event.
 * Checks if the email exists in the system, creates a pending invitation,
 * and sends an invitation link (or account creation link) via email.
 */
exports.inviteAttendee = async (eventId, email, eventGroupId) => {
    // Check if user exists (case-insensitive search)
    const user = await User.findOne({where: {Email: {[Op.iLike]: email}}});

    // Prepare invitation data
    const invitationData = {
        EventID: eventId,
        invitedEmail: email,
        status: "pending",
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Expires in 48h
        token: crypto.randomBytes(16).toString("hex"),
        EventGroupID: eventGroupId,
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
        // TODO: Link for existing user to accept the invitation
        invitationLink = `https://example.com/invitation/accept?invitation=${invitation.token}`;
    } else {
        // TODO: Link for new user to create an account and accept the invitation
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
        eventGroupId: invitation.EventGroupID,
        status: invitation.status,
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
        where: {EventID: eventId},
        include: [
            {model: User, attributes: ["UserID", "FName", "LName", "Email"]},
            {model: Event, attributes: ["EventID", "EventName"]},
        ],
    });

    // Retrieve pending invitations
    const pendingInvitations = await Invitation.findAll({
        where: {EventID: eventId, status: "pending"},
        attributes: ["InvitationID", "invitedEmail", "status"],
    });

    return {
        attendees,
        pendingInvitations,
    };
};

exports.removeAttendee = async (
    eventId,
    targetUserId,
    requesterId,
    requesterRole
) => {
    try {
        // 1. Verify the event exists.
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Event not found");

        

        // 2. Check if the attendee record exists.
        const attendee = await Attendee.findOne({
            where: {EventID: eventId, UserID: targetUserId},
        });
        if (!attendee) {
            throw new Error("Attendee not found");
        }

        if (!requesterRole) {
            // Attendees don't have a role

            if (targetUserId !== requesterId) {
                throw new Error(
                    "User to be removed does not match logged user"
                );
            }
        }

        // 3. Role-based checks:
        else if (requesterRole.includes(Roles.PLANNER)) {
            // Event planners can only manage events they are assigned to.
            const staffRecord = await EventStaff.findOne({
                where: {
                    EventID: eventId,
                    UserID: requesterId,
                    RoleID: {[Sequelize.Op.like]: `%${Roles.PLANNER}%`},
                },
            });

            if (!staffRecord) {
                console.error("Not in organization");
                throw new Error("Not in organization");
            }
        }

        // 4. Update confirmed status
        attendee.Confirmed = false;
        await attendee.save();
        // 5. Proceed to remove the attendee.
        await attendee.destroy();
        return true;
    } catch (error) {
        console.error("Error in service:", error);
        throw error;
    }
};
