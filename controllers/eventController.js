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
            });
        });
        //returns the event Id on success
        return event.EventID
    } catch (error) {

    }
}

/*
get event Types:
returns a list of event types that the user can assign to a event
*/
async function getEventTypes(organizationID) {
    try {
        await sequelize.transaction(async t => {
            //get a list of all default eventTypes

            // get a list of all organization eventTypes that belong to the current organization and append it to the prior list

            //return the list generated
        });
    } catch (error) {

    }

}
