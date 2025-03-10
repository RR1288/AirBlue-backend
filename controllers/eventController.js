const { Organization, Event, EventGroup, EventStaff, Attendee, EventTypes, OrganizationEventTypes, DefaultEventTypes, sequelize } = require("../models");

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
                EventID: event.EventID,
                EventName: name,
                EventStartDate: startDate,
                EventEndDate: endDate,
                EventDescription: description,
                TyperID: typeID,
                OrganizationID: organizationID
            });
            //add the creating user to the event staff as an eventplanner
            const eventStaff = await EventStaff.create({
                UserID: userId,
                EventID: event.EventID,
                Role: 'E' // hard coded that the first addition to the events eventstaff is an eventplanner
            });
        });
        //returns the event Id on success
        return event.EventID;
    } catch (error) {
        throw new Error("Event creation failed");
    }
}

/*
get event Types:
returns a list of event types that the user can assign to a event
*/
async function getEventTypes(organizationID) {
    try {
        let typeList;
        await sequelize.transaction(async t => {
            //get a list of all default eventTypes
            const defaultEventTypes = await DefaultEventTypes.findAll({
                attributes: ['TypeID', 'Name']
            });
            // get a list of all organization eventTypes that belong to the current organization and append it to the prior list
            const organizationEventTypes = await OrganizationEventTypes.findAll({
                attributes: ['TypeID', 'Name'],
                where: { OrganizationID: organizationID}
            });
            //combine the results of each query into one list
            typeList = [...defaultEventTypes, ...organizationEventTypes];
        });
        //return the list generated
        return typeList;
    } catch (error) {

    }

}

module.exports = {createEvent}
