const {Itinerary, Slice, Segment} = require('../models');

exports.getFlightInfo = async (attendeeID) => {
    try {
        //get the itinerary by AttendeeID
        //should run an include on slices here as well
        let flightInfo = await Itinerary.findAll({
            include: [
                {
                    model: Slice,
                    include: [
                        {
                            model: Segment,
                            required: true
                        }
                    ],
                    required: true,
                }
            ],
            where: {AttendeeID: attendeeID}
        }); 
        if (!flightInfo) return {}
        return flightInfo;
    } catch (error) {
        throw new Error('failed to get flight information');
    }
};