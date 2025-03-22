const {Attendee, Event, Itinerary, Slice, Segment, Sequelize} = require('../models');

exports.getEvents = async (userId) => {
    try {
        //TODO add the users eventGroup here for general use
        const events = await Attendee.findAll({
            attributes: [
                ['UserID', 'id'],
            ],
            include: [
                {
                    model: Event,
                    attributes: [
                        ['EventName', 'title'],
                        ['EventStartDate', 'startDate'],
                        ['EventEndDate', 'endDate'],
                        ['Location', 'location'],
                        ['EventDescription', 'description'],
                    ],
                    required: true,
                },
            ],
            where: {UserID: userId}
            
        });
        //if no events then return a blank array
        if(!events) return [];
        return events;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get events');
    }
};

/**
 * function for attendee to see the status of their itinerary
 * @returns on success a single object with the users itinerary status and the cost of their trip
 */
exports.getEventStatus = async (eventId, userId) => {
    try {
        const events = await Attendee.findOne({
            attributes: [
                
            ],
            include: [
                {
                    model: Itinerary,
                    attributes: [['ApprovalStatus', 'status'], ['TotalCost', 'cost']],
                    required: true,
                    where: {UserID: userId, EventID: eventId}
                }
            ],
            where: {UserID: userId, EventID: eventId}
            
        });
        //if no events then return a blank array
        if(!events) return [];
        return events;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get events');
    }
};


