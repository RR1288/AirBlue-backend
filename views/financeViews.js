const { Itinerary, Event, EventStaff, Sequelize, Attendee } = require("../models");
const EventController = require("../controllers/eventController");
const { Op } = require("sequelize");


/**
 *  this function queries events to get all events that the finance user is involved in
 * @param {*} organizationId 
 * @param {*} userId 
 */
exports.getEventsFinance = async (organizationId, userId) => {
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
                        where: { UserID: userId, RoleID: { [Sequelize.Op.like]: `%F%` } }
                    }
                ],
                where: { OrganizationID: organizationId },
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
exports.getJoinableEventsFinance = async (organizationId) => {
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
                where: { OrganizationID: organizationId },
            });

        // Fetch event staff data concurrently for all events
        const eventStaffPromises = events.map(event =>
            EventController.getEventStaffByRole(event.dataValues.id, 'F')
        );

        const eventStaffData = await Promise.all(eventStaffPromises);

        // Filter events that don't have finance users
        const results = events.filter((event, index) => {
            if (eventStaffData[index].length === 0) {
                event.dataValues.orphan = true;
                return true;
            }
            return false;
        });
        return results;
    } catch (error) {
        throw new Error("failed to get events");
    }
};



/**
 * 
 * @param {*} eventID the events id
 * This function is used to get all of the itinerary values for each attendee in an event
 * This function gets all itineraries that where approved and returns a list of objects that are just the breakdown of amount spent.
 */
exports.getEventFlightReport = async (eventID) => {
    try {
        //run query
        let costs = await Event.findOne({
            attributes: [
                ['EventTotalBudget', 'budget']
            ],
            //get the attendees
            include: [
                {
                    model: Itinerary,
                    attributes: [
                        ['TotalCost', 'totalCost'],
                        ['BaseCost', 'ticketCost'],
                        ['TaxCost', 'tax']
                    ],
                    where: { ApprovalStatus: 'approved' }

                }
            ],
            where: { EventID: eventID }
        });
        const totalSpent = await Itinerary.sum('TotalCost', {
            where: { EventID: eventID,ApprovalStatus: 'approved' }
        });
        let results = [totalSpent, costs];
        //return results
        return results;
    } catch (error) {
        throw new Error('failed to get the flight reports');
    }
};
