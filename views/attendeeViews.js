const {Attendee, Event, Itinerary, Slice, Segment, Sequelize} = require('../models');

exports.getEvents = async (userId) => {
    try {
        console.log("USERID: " +userId);
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

exports.getEventStatus = async (eventId, userId) => {
    try {
        const events = await Attendee.findOne({
            attributes: [
                
            ],
            include: [
                {
                    model: Itinerary,
                    attributes: [['ApprovalStatus', 'status']],
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

