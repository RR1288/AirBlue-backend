const {Itinerary, Slice, Segment} = require('../models');

exports.getFlightInfo = async (attendeeID) => {
    try {
        //get the itinerary by AttendeeID
        //should run an include on slices here as well
        let flightInfo = await Itinerary.findAll({
            attributes: [
                ["ItineraryID", 'ItineraryID'],
                ["AttendeeID", "AttendeeID"],
                ["DuffelOrderID", "DuffleOrderID"],
                ["DuffelPassID", "DuffelPassID"],
                ["DuffelOfferID", "DuffelOfferID"],
                ["BookingReference", "BookingReference"],
                ["TotalCost", "TotalCost"],
                ["BaseCost", "BaseCost"],
                ["TaxCost", "TaxCost"],
                ["ApprovalStatus", "ApprovalStatus"],
            ],
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
        if (!flightInfo) return [];
        return flightInfo;
    } catch (error) {
        console.log(error);
        throw new Error('failed to get flight information');
    }
};