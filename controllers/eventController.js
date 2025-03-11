const { Organization, Event, EventGroup, EventStaff, Attendee, EventTypes, OrganizationEventType, DefaultEventType, sequelize, Sequelize } = require("../models");

/*
CREATE EVENT
this function
*/
async function createEvent(userId, name, startDate, endDate, description, typeID, organizationID) {
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
            const eventStaff = await EventStaff.create({
                UserID: userId,
                EventID: event.EventID,
                RoleID: 'E' // hard coded that the first addition to the events eventstaff is an eventplanner
            });
        });
        //returns the event Id on success
        return event.EventID;
    } catch (error) {
        console.log(error);
        throw new Error("Event creation failed");
    }
}

/*
get event Types:
returns a list of event types that the user can assign to a event
*/
async function getEventTypes(organizationID) {
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
                where: { OrganizationID: organizationID},
            });
            //combine the results of each query into one list
            for (let i = 0; i < defaultEventTypes.length; i++){
                typeList.push({TypeID: defaultEventTypes[i].dataValues.TypeID, Name: defaultEventTypes[i].dataValues.Name});
            }
            for (let i = 0; i < organizationEventTypes.length; i++){
                typeList.push({TypeID: organizationEventTypes[i].dataValues.TypeID, Name: organizationEventTypes[i].dataValues.Name});
            }
        });
        //return the list generated
        return typeList;
    } catch (error) {
        console.log(error);
    }

}

module.exports = {createEvent, getEventTypes}
