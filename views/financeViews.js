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
                    ["FlightBudgetThreshold", "threshold"],
                    
                ],

                include: [
                    {
                        model: EventStaff,
                        attributes: [],
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
        if (!events || events.length === 0) return [];
        
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

        // Fetch event staff data concurrently for all events
        const eventStaffPromises = events.map(event => 
            EventController.getEventStaffByRole(event.dataValues.id, 'F')
        );

        const eventStaffData = await Promise.all(eventStaffPromises);

        // Filter events that don't have finance users
        const results = events.filter((event, index) => {
            if (eventStaffData[index].length === 0) {
                event.financeUser = null;
                return true;
            }
            return false;
        });

        return results;
    } catch (error) {
        throw new Error("failed to get events");
    }
};

//helpers


