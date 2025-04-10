const {Attendee, Invitation, User, Event, EventStaff, sequelize, Sequelize} = require("../models");
const {Op} = require("sequelize");
// const {Sequelize} = require("sequelize");
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
    const user = await User.findOne({ where: { Email: { [Op.iLike]: email } } });

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
        invitationLink = `https://airblue-frontend-staging-e0760dff2ded.herokuapp.com/accept-invite?invitation=${invitation.token}`;
    } else {
        // TODO: Link for new user to create an account and accept the invitation
        invitationLink = `https://airblue-frontend-staging-e0760dff2ded.herokuapp.com/register?invitation=${invitation.token}`;
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
        where: { EventID: eventId },
        include: [
            { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
            { model: Event, attributes: ["EventID", "EventName"] },
        ],
    });

    // Retrieve pending invitations
    const pendingInvitations = await Invitation.findAll({
        where: { EventID: eventId, status: "pending" },
        attributes: ["InvitationID", "invitedEmail", "status"],
    });

    return {
        attendees,
        pendingInvitations,
    };
};

exports.revokeInvitations = async (
    eventId,
    invitationIds,
    requesterId,
    requesterRole
) => {
    try {
        // 1. Verify the event exists.
        const event = await Event.findByPk(eventId);
        if (!event) throw new Error("Event not found");

        // 2. Check authorization
        const isAuthorized = await this.checkPlannerAuthorization(
            requesterRole,
            eventId,
            requesterId
        );

        if (!isAuthorized) {
            console.error("Not authorized");
            throw new Error("Not authorized");
        }

        // 3. Fetch all pending invitations for the provided invitationIds
        const invitations = await Invitation.findAll({
            where: {
                EventID: eventId,
                InvitationID: {[Op.in]: invitationIds},
                status: "pending",
            },
        });

        // 4. If no invitations are found, return false
        if (invitations.length === 0) return false;

        // 5. Use a transaction to ensure consistency when invalidating and deleting invitations
        const transaction = await sequelize.transaction();

        try {
            const revoked = [];

            for (const invitation of invitations) {
                // Mark invitation as invalid and destroy it within the transaction
                await this.invalidInvitation(invitation, transaction); // Pass transaction
                revoked.push(invitation.InvitationID);
            }

            // Commit transaction after all deletions are successful
            await transaction.commit();
            return revoked; // Return the IDs of revoked invitations
        } catch (error) {
            // If something goes wrong, rollback the transaction
            await transaction.rollback();
            console.error("Error in revoking invitations:", error);
            throw new Error("Error processing revocation");
        }
    } catch (error) {
        console.error("Error in service:", error);
        throw new Error("Error processing request");
    }
};

/**
 * Cancel the logged-in user's own pending invitation or attendance.
 */
exports.cancelOwnParticipation = async (eventId, requesterId) => {
    // Attempt to cancel a pending invitation first.
    const invitation = await Invitation.findOne({
        where: { EventID: eventId, UserID: requesterId },
    });

    if (invitation) {
        invitation.status = "declined";
        invitation.expiresAt = new Date();
        await invitation.save();
        await invitation.destroy();
        return { canceled: true, method: "invitation", id: invitation.id };
    }

    // If no invitation exists, check if the user is a confirmed attendee.
    const attendee = await Attendee.findOne({
        where: { EventID: eventId, UserID: requesterId },
    });

    if (attendee) {
        invitation.status = "declined";
        invitation.expiresAt = new Date();
        await invitation.save();
        await attendee.destroy();
        return { canceled: true, method: "attendee", id: attendee.id };
    }

    // If neither record exists, throw an error.
    throw new Error(
        "No invitation or attendance record found for cancellation."
    );
};

/**
 * Remove confirmed attendees from an event.
 * Only a planner who is authorized for the event can remove confirmed attendees.
 */
exports.removeConfirmedAttendees = async (
    eventId,
    userIds,
    requesterId,
    requesterRole
) => {
    // 1. Check authorization
    const isAuthorized = await this.checkPlannerAuthorization(
        requesterRole,
        eventId,
        requesterId
    );

    if (!isAuthorized) {
        console.error("Not authorized");
        throw new Error("Not authorized");
    }

    // 2. For each user id remove their attendance
    const removed = [];
    // Looks for attendees, not users
    for (const userId of userIds) {
        const attendee = await Attendee.findByPk(userId);
        if (attendee) {
            attendee.Confirmed = false;
            await attendee.save();
            await attendee.destroy();
            removed.push(userId);
        }
    }
    return removed.length > 0 ? removed : false;
};

exports.updateAttendeeEventGroup = async (attendeeId, eventGroupId) => {
    try {
        // Find the attendee by attendeeId
        const attendee = await Attendee.findByPk(attendeeId);
        if (!attendee) {
            throw new Error("Attendee not found");
        }

        // Update the attendee's eventGroupId
        attendee.EventGroupID = eventGroupId;
        await attendee.save(); // Persist the change

        return attendee; // Return the updated attendee
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update attendee's event group");
    }
};




//=========== UTILS ===============================================
exports.checkPlannerAuthorization = async (
    requesterRole,
    eventId,
    requesterId
) => {
    if (requesterRole.includes(Roles.PLANNER)) {
        // Event planners can only manage events they are assigned to.
        const staffRecord = await EventStaff.findOne({
            where: {
                EventID: eventId,
                UserID: requesterId,
                RoleID: { [Sequelize.Op.like]: `%${Roles.PLANNER}%` },
            },
        });

        if (!staffRecord) {
            return false;
        }
        return true;
    } else {
        return false;
    }
};

exports.invalidInvitation = async (invitation, transaction) => {
    invitation.expiresAt = new Date(); // Invalid invitation
    await invitation.save({transaction}); // Save before deleting it
    await invitation.destroy({transaction});
};

exports.updateTokenOnUserCreation = async (inviteToken) => {
    try {
        //start transaction
        await sequelize.transaction(async (t) => {
            //get invitation
            let invitation = await Invitation.findOne({
                where: { token: inviteToken },
            }, { transaction: t });
            //get invitedEmail
            const email = invitation.dataValues.Email;
            //get user where invitedEmail == email
            let user = await User.findOne({
                attributes: ['UserID', 'id'],
                where: { Email: email }
            }, { transaction: t });
            //set user id to the recieved users id
            let userId;
            invitation.update({
                UserID: userId,
            }, { transaction: t });
            //close transaction
        });
        //return true on success
        return true;
    } catch (error) {
        throw new Error("failed to update token");
    }
};
