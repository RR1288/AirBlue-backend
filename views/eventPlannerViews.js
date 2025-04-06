const {
    Sequelize,
    Attendee,
    Itinerary,
    Invitation,
    User,
    EventGroup,
    EventStaff,
    Event,
    Slice,
} = require("../models");

//simple call to get all attendees for a specific event. This will also include their status from itinerary if they are pending approval
exports.getAttendees = async (eventID) => {
    try {
        let attendees = await Attendee.findAll({
            attributes: [["AttendeeID", "attendeeID"]],
            include: [
                {
                    model: User,
                    attributes: [
                        ["Email", "email"],
                        ["FName", "firstName"],
                        ["LName", "lastName"],
                    ],
                    required: true,
                },
                {
                    model: Itinerary,
                    attributes: [
                        ["ApprovalStatus", "status"],
                        ["TotalCost", "cost"],
                        ["DuffelOrderID", 'orderId'],
                    ],
                },
                {
                    model: EventGroup,
                    attributes: [
                        ["Name", "name"],
                        ["FlightBudget", "budget"],
                    ],
                    required: true,
                },
            ],
            where: {EventID: eventID},
        });
        let results = [];
        //making it so that I am only returning the information that I want
        for (let i = 0; i < attendees.length; i++) {
            let combinedName =
                attendees[i].User.dataValues.firstName + " " + 
                attendees[i].User.dataValues.lastName;
            //checking to make sure there are actual values for bookingCost and status in Itinerary
            let booking = attendees[i].Itineraries;
            if (!booking) booking = null;
            results.push({
                ID: attendees[i].dataValues.attendeeID,
                Name: combinedName,
                email: attendees[i].User.dataValues.email,
                Booking: booking,
                groupName: attendees[i].EventGroup.dataValues.name,
                budget: attendees[i].EventGroup.dataValues.budget,
            });
        }
        return results;
    } catch (error) {
        console.log(error);
        throw new Error("failed to get attendees for event");
    }
};

exports.getAttendeesForApproval = async (userID) => {
    try {
        //get the raw information
        let attendees = await EventStaff.findAll({
            attributes: [], //not saving any values from eventstaff
            include: [
                //join on events model
                {
                    model: Event,
                    required: true,
                    attributes: [
                        ["EventID", "id"],
                        ["EventName", "title"],
                        ["EventStartDate", "startDate"],
                        ["EventEndDate", "endDate"],
                        ["Location", "location"],
                        ["EventTotalBudget", "eventBudget"],
                        ["EventFlightBudget", "flightBudget"],
                    ],
                    include: [
                        {
                            model: Attendee,
                            required: true,
                            attributes: [
                                ["UserID", "userID"], // for now I believe I only need to pass in the user ID
                            ],
                            include: [
                                {
                                    model: User,
                                    attributes: [
                                        ["Email", "email"],
                                        ["FName", "firstName"],
                                        ["LName", "lastName"],
                                    ],
                                    required: true,
                                },
                                {
                                    // get eventgroup name and budget for purpose of checking if they are on budget
                                    model: EventGroup,
                                    required: true,
                                    attributes: [
                                        ["Name", "name"],
                                        ["FlightBudget", "budget"],
                                    ],
                                },
                                //get the related Itinerary for the event
                                {
                                    model: Itinerary,
                                    required: true,
                                    attributes: [
                                        ["ItineraryID", "ItineraryID"],
                                        ["AttendeeID", "AttendeeID"],
                                        ["DuffelOrderID", "DuffleOrderID"],
                                        ["DuffelPassID", "DuffelPassID"],
                                        ["DuffelOfferID", "DuffelOfferID"],
                                        [
                                            "BookingReference",
                                            "BookingReference",
                                        ],
                                        ["TotalCost", "TotalCost"],
                                        ["BaseCost", "BaseCost"],
                                        ["TaxCost", "TaxCost"],
                                        ["ApprovalStatus", "ApprovalStatus"],
                                    ],
                                    where: {ApprovalStatus: "pending"},
                                    //get all slices in the itinerary
                                    include: [
                                        {
                                            model: Slice,
                                            required: true,
                                            attributes: [
                                                ["OriginAirport", "origin"],
                                                ["OriginCity", "originCity"],
                                                ["OriginIATA", "originIATA"],
                                                [
                                                    "DestinationAirport",
                                                    "destination",
                                                ],
                                                [
                                                    "DestinationCity",
                                                    "destinationCity",
                                                ],
                                                [
                                                    "DestinationIATA",
                                                    "destinationIATA",
                                                ],
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],

            where: {UserID: userID, RoleID: {[Sequelize.Op.like]: `%E%`}},
        });

        return attendees;
    } catch (error) {
        console.log(error);
        throw new Error("failed to get attendees for event");
    }
};

exports.getInvitees = async (eventID) => {
    try {
        //get the invited users
        const invitees = await Invitation.findAll({
            attributes: [
                ["invitedEmail", "email"],
                ["status", "status"],
            ],
            include: [
                {
                    model: EventGroup,
                    as: "eventGroup",
                    required: true,
                    attributes: [["Name", "name"]],
                },
            ],
            where: {EventID: eventID},
        });
        //format results(if needed)
        let results = [];
        //making it so that I am only returning the information that I want
        for (let i = 0; i < invitees.length; i++) {
            let status = invitees[i].dataValues.status;
            if (!status) status = null;
            results.push({
                email: invitees[i].dataValues.email,
                status: status,
                groupName: invitees[i].eventGroup
                    ? invitees[i].eventGroup.dataValues.name
                    : null,
            });
        }
        //return query results
        return results;
    } catch (error) {
        console.log(error);
        throw new Error("failed to get invited users");
    }
};

exports.getEventsPlanner = async (organizationId, userId) => {
    try {
        //get all events where the finance user is a part of
        let events = await Event.findAll({
            attributes: [
                ["EventID", "id"],
                ["EventName", "title"],
                ["EventStartDate", "startDate"],
                ["EventEndDate", "endDate"],
                ["Location", "location"],
                ["EventDescription", "description"],
                ["EventTotalBudget", "eventBudget"],
                ["EventFlightBudget", "flightBudget"],
                ["MaxAttendees", "maxAttendees"],
                ["ExpectedAttendees", "expectedAttendees"],
                ["FlightBudgetThreshold", "threshold"],
            ],

            include: [
                {
                    model: EventStaff,
                    attributes: [],
                    required: true,
                    where: {
                        UserID: userId,
                        RoleID: {[Sequelize.Op.like]: `%E%`},
                    },
                },
                {
                    model: EventGroup
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

/**
 * This function takes an eventID and gets the total number of attendees in that event as well as the total number of approved Itineraries
 * Additionally it gets the events total budget and the current budget spent and returns it as an object
 */
exports.getEventReportPlanner = async (eventID) => {
    try {
        //get attendee count information
        let totalAttendees = await Attendee.count({where: {EventID: eventID}});
        let approvedAttendees = await Itinerary.count({where: {EventID: eventID, ApprovalStatus: 'approved'}});
        //get budget information
        let totalBudget = await Event.findOne({
            attributes: [['EventTotalBudget','budget']],
            where: {EventID: eventID}
        });
        let totalSpent = await Itinerary.sum('TotalCost', {
            where: { EventID: eventID, ApprovalStatus: 'approved'}
        });
        //create object for return
        let results = {
            'TotalAttendees': totalAttendees,
            'ApprovedAttendees': approvedAttendees,
            'TotalBudget': totalBudget.dataValues.budget,
            'TotalSpent': totalSpent
        };
        return results;
    
    } catch (error) {
        console.log(error);
        throw new Error('failed to get report');
    }
}