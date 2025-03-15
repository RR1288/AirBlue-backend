const { User, Organization, Event, EventGroup, EventStaff, Attendee, EventTypes, OrganizationEventType, DefaultEventType, sequelize, Sequelize } = require("../models");

/*
CREATE EVENT
this function
*/
exports.createEvent = async (userId, name, startDate, endDate, description, typeID, organizationID) => {
    try {
        let event;
        await sequelize.transaction(async t => {
            //create the event
            event = await Event.create({
                EventName: name,
                EventStartDate: startDate,
                EventEndDate: endDate,
                EventDescription: description,
                TypeID: typeID,
                OrganizationID: organizationID
            });
            //add the creating user to the event staff as an eventplanner
            this.addToEventStaff(userId, event.EventID, 'E');
        });
        //returns the event Id on success
        return event.EventID;
    } catch (error) {
        console.log(error);
        throw new Error("Event creation failed");
    }
}


//gets eventByID
exports.getEventByID = async (eventID) => {
    return await Event.findByPk(eventID);
}


/*
get event Types:
returns a list of event types that the user can assign to an event
*/
exports.getEventTypes = async (organizationID) => {
    try {
        let typeList = [];
        await sequelize.transaction(async t => {
            //get a list of all default eventTypes
            let defaultEventTypes = await DefaultEventType.findAll({
                attributes: ['TypeID', 'Name'],
            });
            // get a list of all organization eventTypes that belong to the current organization and append it to the prior list
            let organizationEventTypes = await OrganizationEventType.findAll({
                attributes: ['TypeID', 'Name'],
                where: { OrganizationID: organizationID },
            });
            //combine the results of each query into one list
            for (let i = 0; i < defaultEventTypes.length; i++) {
                typeList.push({ TypeID: defaultEventTypes[i].dataValues.TypeID, Name: defaultEventTypes[i].dataValues.Name });
            }
            for (let i = 0; i < organizationEventTypes.length; i++) {
                typeList.push({ TypeID: organizationEventTypes[i].dataValues.TypeID, Name: organizationEventTypes[i].dataValues.Name });
            }
        });
        //return the list generated
        return typeList;
    } catch (error) {
        console.log(error);
    }
}

exports.getAttendees = async (eventId) => {
    return await Attendee.findAll({
        where: { EventID: eventId },
        include: [
            { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
            { model: Event, attributes: ["EventID", "EventName"] },
        ],
    });
};

/**
 * Get event staff based on event ID and role.
 * The role to filter by ('E' for Event Planner, 'F' for Finance).
 */
exports.getEventStaffByRole = async (eventId, role) => {
    return await EventStaff.findAll({
        where: { EventID: eventId, RoleID: { [Sequelize.Op.like]: `%${role}%` } },
        include: [
            { model: User, attributes: ["UserID", "FName", "LName", "Email"] },
            { model: Event, attributes: ["EventID", "EventName"] },
        ],
    });
};
exports.getEventStaff = async (userID, eventID) => {
    try{
        return await EventStaff.findAll({where: {EventID: eventID, UserID: userID}});
    }catch(error){
        throw new Error("failed to find entry in event staff");
    }
};

exports.setEventBudget = async (eventID, totalBudget, flightBudget) => {
    try {
        let event = await Event.findByPk(eventID);
        if (!event) {
            throw new Error("event does not exist");
        }

        await event.update({
            EventTotalBudget: totalBudget,
            EventFlightBudget: flightBudget
        });
        return true;
    } catch (error) {
        throw new Error("failed to add budget");
    }

};

exports.appendRoleToEventStaff = async (userID, eventID, role) => {
try {
    //get the users entry for event staff
    let staff = await EventStaff.findOne({
        where: { EventID: eventID, UserID: userID },
    });
    //create a new value for the roleID in event staff
    let newRole = staff.RoleID + role;
    //update event staff with the new value for RoleID
    staff.update({RoleID: newRole});
    //return true on success
    return true;
} catch (error) {
    console.log(error);
    throw new Error("failed to append role to eventstaff entry for user");
}
};

exports.addToEventStaff = async (userID, eventID, role) => {
    try {
        const eventStaff = await EventStaff.create({
            UserID: userID,
            EventID: eventID,
            RoleID: role
        });
        return true;
    } catch (error) {
        throw new Error("failed to add user to event staff");
    }

};

