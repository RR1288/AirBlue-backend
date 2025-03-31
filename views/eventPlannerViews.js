const { Sequelize, Attendee, Itinerary, Invitation, User, EventGroup, EventStaff, Event } = require('../models');

//simple call to get all attendees for a specific event. This will also include their status from itinerary if they are pending approval
exports.getAttendees = async (eventID) => {
    try {
        let attendees = await Attendee.findAll({
            attributes: [
                ['UserID', 'userID'],
            ],
            include: [
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
            let combinedName = attendees[i].User.dataValues.firstName + attendees[i].User.dataValues.lastName;
            //checking to make sure there are actual values for bookingCost and status in Itinerary
            let booking = attendees[i].Itineraries;
            if (!booking) booking = null;
            results.push(
                {
                    'Name': combinedName,
                    'email': attendees[i].User.dataValues.email,
                    'Booking': booking,
                    'groupName': attendees[i].EventGroup.dataValues.name,
                    'budget': attendees[i].EventGroup.dataValues.budget, 
                });
        }
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get attendees for event');
    }
};

exports.getAttendeesForApproval = async (eventID) => {
    try {
        let attendees = await Attendee.findAll({
            attributes: [
                ['UserID', 'userID'],
            ],
            include: [
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
                    where: {ApprovalStatus: 'pending'},
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
            let combinedName = attendees[i].User.dataValues.firstName + attendees[i].User.dataValues.lastName;
            //checking to make sure there are actual values for bookingCost and status in Itinerary
            let booking = attendees[i].Itineraries;
            if (!booking) booking = null;
            results.push(
                {
                    'Name': combinedName,
                    'email': attendees[i].User.dataValues.email,
                    'Booking': booking,
                    'groupName': attendees[i].EventGroup.dataValues.name,
                    'budget': attendees[i].EventGroup.dataValues.budget, 
                });
        }
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get attendees for event');
    }
};

exports.getInvitees = async (eventID) => {
    try {
        //get the invited users
            const invitees = await Invitation.findAll({
                attributes: [
                    ['invitedEmail', 'email'],
                    ['status', 'status'],
                ],
                include: [{
                    model: EventGroup,
                    as: 'eventGroup',
                    required: true,
                    attributes: [['Name','name']]
                }],
                where: {EventID: eventID}
            });
        //format results(if needed)
        let results = [];
        //making it so that I am only returning the information that I want
        for (let i = 0; i < invitees.length; i++) {
            let status = invitees[i].dataValues.status;
            if (!status) status = null;
            results.push(
                {
                    'email': invitees[i].dataValues.email,
                    'status': status,
                    'groupName': invitees[i].eventGroup ? invitees[i].eventGroup.dataValues.name : null, 
                });
        }
        //return query results
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get invited users');
    }
};

exports.getEventsPlanner = async(organizationId, userId) =>{
    try {
        //get all events where the finance user is a part of
        console.log('in getting events planner')
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
                        attributes: [],
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
        console.log(error);
        throw new Error("failed to get events");
    }
};