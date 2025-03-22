const {Attendee, Event, Itinerary, EventGroup , Slice, Segment, Sequelize} = require('../models');

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
        results = [];
        for (let i = 0; i < events.length ; i++){
            //add check to see if Itinerary exists. if nto it will set the status to 'select' and cost = o
            let iStatus;
            let iCost;
            if (events[i].dataValues.Itinerary === null){
                iStatus = 'select';
                iCost = 0.00;
            }else{
                iStatus = events[i].dataValues.Itinerary.status;
                iCost = events[i].dataValues.Itinerary.cost;
            }
            results.push({
                'id' : events[i].dataValues.id,
                'name' : events[i].dataValues.Event.title,
                'startDate' : events[i].dataValues.Event.startDate,
                'endDate' : events[i].dataValues.Event.endDate,
                'location' :  events[i].dataValues.Event.location,
                'description' : events[i].dataValues.Event.description,
                'status': iStatus,
                'cost': iCost,
                'groupName': events[i].dataValues.EventGroup.name,
                'flightBudget': events.dataValues.EventGroup.budget
            });
        }

        //if no events then return a blank array
        return results;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get events');
    }
};

