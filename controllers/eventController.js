const {User, Event, EventStaff, Attendee, Invitation, Sequelize} = require("../models");
const { Op } = require("sequelize");

exports.getAttendees = async (eventId) => {
    return await Attendee.findAll({
        where: {EventID: eventId},
        include: [
            {model: User, attributes: ["UserID", "FName", "LName", "Email"]},
            {model: Event, attributes: ["EventID", "EventName"]},
        ],
    });
};

/**
 * Get event staff based on event ID and role.
 * The role to filter by ('E' for Event Planner, 'F' for Finance).
 */
exports.getEventStaffByRole = async (eventId, role) => {
    return await EventStaff.findAll({
        where: {EventID: eventId, RoleID: {[Sequelize.Op.like]: `%${role}%`}},
        include: [
            {model: User, attributes: ["UserID", "FName", "LName", "Email"]},
            {model: Event, attributes: ["EventID", "EventName"]},
        ],
    });
};

exports.processInvitationAcceptance = async (invitationToken) => {
    try {
        // Find the invitation using the token
        const invitation = await Invitation.findOne({
            where: {
                token: invitationToken,
                status: "pending",
                expiresAt: { [Op.gt]: new Date() }, // Ensure it's not expired
            },
        });

        if (!invitation) {
            console.error("Invitation not found");
            throw new Error("Invitation not found");
        }

        // Find the user
        let user = await User.findByPk(invitation.UserID);

        if (!user) {
            console.error("User not found");
            throw new Error("User not found"); // User should have created an account before accepting
        }

        // Check if user is already an attendee
        const existingAttendee = await Attendee.findOne({
            where: { EventID: invitation.EventID, UserID: user.UserID, EventGroupID: invitation.EventGroupID },
        });

        if (existingAttendee) {
            console.error("User is already an attendee");
            return true; // User is already an attendee
        }

        // Add user to Attendees table
        await Attendee.create({
            EventID: invitation.EventID,
            UserID: user.UserID,
            Confirmed: true,
            EventGroupID: invitation.EventGroupID,
        });

        // Mark invitation as accepted
        await invitation.update({ status: "accepted" });
        return true;

    } catch (error) {
        console.error("Error processing invitation acceptance:", error);
        throw new Error("Error processing invitation");
    }
};