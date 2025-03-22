const {Itinerary, Event, EventStaff, Sequelize} = require("../models");
const EventController = require("../controllers/eventController");
const { Op } = require("sequelize");


/**
 *  this function queries events to get all events that the finance user is involved in
 * @param {*} organizationId 
 * @param {*} userId 
 */
exports.getEventsFinance = async(organizationId, userId) =>{
    try {
        //get all events where the finance user is a part of
        let events = await Event.findAll(
            {
                attributes: [
                    ['EventID', 'id'],
                    ['EventName', 'title'],
                    ['EventStartDate', 'startDate'],
                    ['EventEndDate', 'endDate'],
                    ['Location', 'location'],
                    ['EventDescription', 'description'],
                    ['EventTotalBudget', 'eventBudget'],
                    ['EventFlightBudget', 'flightBudget'],
                    ["MaxAttendees", 'maxAttendees'],
                    
                ],

                include: [
                    {
                        model: EventStaff,
                        attributes: [['UserID', 'financeUser']],
                        required: true,
                        where: {UserID: userId, RoleID: { [Sequelize.Op.like]: `%F%` }}
                    }
                ],
                where: {OrganizationID: organizationId},
        });
        /*
        TODO:
        add functionality to add the userName instead of id for the financeUser field
        add functiosn to return info for statistics
         */ 
        if (!events || events === null) return [];
        return events;
    } catch (error) {
        throw new Error("failed to get events");
    }
};

/**
 *  this function queries events to get all events that have no finance users
 * @param {*} organizationId 
 */
exports.getJoinableEventsFinance = async(organizationId) =>{
    try {
        let results = [];
        //get all events where the finance user is a part of
        let events = await Event.findAll(
            {
                attributes: [
                    ['EventID', 'id'],
                    ['EventName', 'title'],
                    ['EventStartDate', 'startDate'],
                    ['EventEndDate', 'endDate'],
                    ['Location', 'location'],
                    ['EventDescription', 'description'],
                    ['EventTotalBudget', 'eventBudget'],
                    ['EventFlightBudget', 'flightBudget'],
                    ["MaxAttendees", 'maxAttendees'],
                    
                ],
                where: {OrganizationID: organizationId},
        });
        //check to see if eventShows up in list of events with finance users
        for (let i = 0; i < events.length; i++){
            //get the id from the event
            let eventId = parseInt(events[i].dataValues.id);
            console.log(eventId);
            let eventStaff = await EventController.getEventStaffByRole(eventId, 'F');
            console.log(eventStaff.length);
            //check to see if event has a finance user
            if (eventStaff.length === 0){
                //if it does not have a finance user it should add the financeUser field to the object and then push it to the results array
                events[i].financeUser = null;
                results.push(events[i]);
            }
        }
        console.log(results);
        return results;
    } catch (error) {
        throw new Error("failed to get events");
    }
};

//helpers


