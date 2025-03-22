const { Sequelize, Attendee, Itinerary, Invititation, User, EventGroup } = require('../models');

//simple call to get all attendees for a specific event. This will also include their status from itinerary if they are pending approval
exports.getAttendees = async (eventID) => {
    try {
        let attendees = await Attendee.findAll({
            attributes: [
                ['UserID', 'userID'],
            ],
            includes: [
                {
                    model: User,
                    attributes: [
                        ['Email', 'email'],
                        ['FName', 'firstName'],
                        ['LName', 'lastName']
                    ],
                    required: true
                },
                {
                    model: Itinerary,
                    attributes: [['ApprovalStatus', 'status'], ['TotalCost', 'cost']],
                    where: { ApprovalStatus: 'pending' }//could be a sticking point keep in mind for manual test
                },
                {
                    model: EventGroup,
                    attributes: [['Name', 'name'], ['FlightBudget', 'budget']],
                    required: true,
                },

            ],
            where: { EventID: eventID }
        });
        let results = [];
        //making it so that I am only returning the information that I want
        for (let i = 0; i < attendees.length; i++) {
            let combinedName = attendees[i].dataValues.User.firstName + attendees[i].dataValues.User.lastName;
            //checking to make sure there are actual values for bookingCost and status in Itinerary
            let bookingCost = attendees[i].dataValues.Itinerary.cost;
            if (!bookingCost) bookingCost = null;
            let status = attendees[i].dataValues.Itinerary.status;
            if (!status) status = null;
            results.push(
                {
                    'Name': combinedName,
                    'email': attendees[i].dataValues.User.email,
                    'status': status,
                    'bookingCost': bookingCost,
                    'groupName': attendees[i].dataValues.EventGroup.name,
                    'budget': attendees[i].dataValues.EventGroup.budget, 
                });
        }
        return results;
    } catch (error) {
        throw new Error('failed to get attendees for event');
    }
};

exports.getInvitees = async (eventID) => {
    try {
        //get the invited users

        //format results(if needed)

        //return query results
    } catch (error) {
        throw new Error('failed to get invited users');
    }
};

exports.getEventsPlanner = async(organizationId, userId) =>{
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
                    ["ExpectedAttendees", 'expectedAttendees'],
                    
                ],

                include: [
                    {
                        model: EventStaff,
                        attributes: [['UserID', 'eventPlanner']],
                        required: true,
                        where: {UserID: userId, RoleID: { [Sequelize.Op.like]: `%E%` }}
                    }
                ],
                where: {OrganizationID: organizationId},
        });
        //TODO add functionality to format the results into single non nested objects with no info on tables names
        if (!events || events === null) return [];
        return events;
    } catch (error) {
        throw new Error("failed to get events");
    }
};