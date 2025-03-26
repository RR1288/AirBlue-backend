const {Attendee, Event, Itinerary, EventGroup ,Invitation, User, Sequelize} = require('../models');

exports.getEvents = async (userId) => {
    try {
        //TODO add the users eventGroup here for general use
        const events = await Attendee.findAll({
            attributes: [['AttendeeID', 'id']],
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
                {
                    model: Itinerary,
                    attributes: [['ApprovalStatus', 'status'], ['TotalCost', 'cost']],
                },
                {
                    model: EventGroup,
                    required: true,
                    attributes: [
                        ['Name', 'name'],
                        ['FlightBudget', 'budget']
                    ]

                }
            ],
            where: {UserID: userId}
            
        });
        //format the results into a single non nested object
        let results = [];
        for (let i = 0; i < events.length ; i++){
            //add check to see if Itinerary exists. if nto it will set the status to 'select' and cost = o
            let iStatus;
            let iCost;
            if (events[i] || events[i].dataValues.Itineraries === null){
                iStatus = 'select';
                iCost = 0.00;
            }else{
                iStatus = events[i].dataValues.Itineraries[0].dataValues.status;
                iCost = events[i].dataValues.Itineraries[0].dataValues.cost;
            }
            results.push({
                'id' : events[i].dataValues.id,
                'name' : events[i].dataValues.Event.dataValues.title,
                'startDate' : events[i].dataValues.Event.dataValues.startDate,
                'endDate' : events[i].dataValues.Event.dataValues.endDate,
                'location' :  events[i].dataValues.Event.dataValues.location,
                'description' : events[i].dataValues.Event.dataValues.description,
                'status': iStatus,
                'cost': iCost,
                'groupName': events[i].dataValues.EventGroup.dataValues.name,
                'flightBudget': events[i].dataValues.EventGroup.dataValues.budget
            });
            console.log(results);
        }

        //if no events then return a blank array
        return results;
    } catch (error) {
        throw new Error('failed to get events');
    }
};

exports.getInvitesAttendee = async (userId) =>{
    try {
        let invites = await Invitation.findAll({
            include: [
                {
                attributes: [
                    ['UserID', 'UserID']
                ],
                model: User,
                as: 'user',
                requird: true
                }
            ],
            where: {'UserID': userId}
        });
        if (!invites) return [];
        return invites;
    } catch (error) {
        throw new Error('failed to get invites');
    }
};