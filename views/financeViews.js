const {Itinerary, Event, EventStaff, Sequelize, EventBudgetAuditLog, User,Attendee} = require("../models");
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
 * This function is used to get the history from the audit logs for event budget and see who edited things and when
 */
exports.getBudgetLogs = async (eventID) => {
    try {
        let logs = await EventBudgetAuditLog.findAll({
            attributes: [
                ['ColumnName', 'chgCol'],
                ['CurrentValue', 'new'],
                ['PreviousValue', 'original'],
                ['createdAt', 'dateEdited']
            ],
            include: [
                {
                    model: User,
                    required: true,
                    attributes: [['Email', 'user']]

                }
            ],
            where: {EventID: eventID}
        });
        let results = [];
        for (let i = 0 ; i < logs.length; i++){
            results.push({
                editor: logs[0].User.dataValues.user,
                changedItem: logs[0].dataValues.chgCol,
                newValue: logs[0].dataValues.new,
                priorValue: logs[0].dataValues.original,
                dateEdited: logs[0].dataValues.dateEdited,
            });
        }

        return results;
    } catch (error) {
        throw new Error("failed to get BudgetHistory");
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
                ['EventName', 'name'],
                ['EventStartDate', 'startDate'],
                ['EventEndDate', 'endDate'],
                ['EventTotalBudget', 'currentBudget'],
                ['FlightBudgetThreshold','currentThreshold']
            ],
            //get the attendees
            include: [
                {
                    model: Itinerary,
                    attributes: [
                        ['TotalCost', 'totalCost'],
                        ['BaseCost', 'ticketCost'],
                        ['TaxCost', 'tax'],
                        ['BudgetOnBook', 'budget'],
                        ['ThresholdOnBook','threshold'],
                        ['GroupName','groupname']
                    ],
                    where: { ApprovalStatus: 'approved' }

                }
            ],
            where: { EventID: eventID }
        });
        //getting amount spent in the event
        const totalSpent = await Itinerary.sum('TotalCost', {
            where: { EventID: eventID,ApprovalStatus: 'approved' }
        });
        //getting attendee information
        let totalAttendees = await Attendee.count({where: {EventID: eventID}});
        let approvedAttendees = await Itinerary.count({where: {EventID: eventID, ApprovalStatus: 'approved'}});

        let results = {
            TotalSpent: totalSpent, 
            TotalAttendees: totalAttendees,
            ApporvedAttendees: approvedAttendees,
            Event: costs
        };
        //return results
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get the flight reports');
    }
};
