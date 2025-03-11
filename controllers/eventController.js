const {User, Event, EventStaff, Attendee, Sequelize} = require("../models");

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
