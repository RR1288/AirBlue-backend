const flightController = require("../controllers/flightController");
const flightView = require("../views/flightViews");
const {sendSuccess, sendError} = require("../utils/responseHelpers");
const {validateFlightParams} = require("../utils/flightUtils");

exports.createRequest = async (req, res) => {
    try {
        // Validate request parameters
        // Expects { origin, destination, departureDate, returnDate, cabinClass }
        validateFlightParams(req.query);

        // Proceed with creating a request
        const request_id = await flightController.createOfferRequest(req.query);
        return sendSuccess(res, "Created request successfully", {request_id});
    } catch (error) {
        console.error(error);
        return sendError(res, "Failed to create offer request", 500);
    }
};

exports.getOffers = async (req, res) => {
    try {
        const {offer_request_id, limit, after, before} = req.query;

        if (!offer_request_id) {
            return sendError(
                res,
                "Missing required parameter: offer_request_id",
                400
            );
        }

        // Validate limit
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            return sendError(res, "Invalid limit parameter", 400);
        }

        // Call the controller with pagination parameters
        const offers = await flightController.fetchOffers({
            offerRequestId: offer_request_id,
            limit: parsedLimit,
            // TODO: validate after and before
            after,
            before,
        });

        return sendSuccess(res, "Offers fetched successfully", {offers});
    } catch (error) {
        return sendError(res, error.message || "Failed to fetch offers", 500);
    }
};

exports.fetchFlight = async (req, res) => {
    try {
        const {offer_id} = req.params;
        const flight = await flightController.fetchFlight(offer_id);
        if (flight) {
            return sendSuccess(res, "Fetched flight successfully", {flight});
        } else {
            return sendError(res, "Flight not found", 404);
        }
    } catch (error) {
        console.error(error);
        return sendError(res, "Failed to fetch flight", 500);
    }
};

exports.holdOffer = async (req, res) => {
    try {
        const {offer_id} = req.params;
        const {passengers, event_id} = req.body;

        if (!offer_id || !passengers) {
            return sendError(res, "Missing required fields", 400);
        }
        const order = await flightController.holdOffer(
            req.user.UserID,
            event_id,
            offer_id,
            passengers
        );
        if (order) {
            return sendSuccess(res, "Holded flight successfully", {order});
        } else {
            return sendError(res, "Couldn't hold flight", 400);
        }
    } catch (error) {
        console.error(error);
        return sendError(res, "Failed to hold flight", 500);
    }
};

exports.bookFlight = async (req, res) => {
    try {
        const {order_id} = req.params;
        if (!order_id) {
            return sendError(res, "Missing required fields", 400);
        }

        const order = await flightController.bookFlight(order_id);

        if (order) {
            return sendSuccess(res, "Booked flight successfully", {order});
        } else {
            return sendError(res, "Couldn't book flight", 400);
        }
    } catch (error) {
        console.error(error);
        return sendError(res, "Failed to book flight", 500);
    }
};

exports.declinePendingFlight = async (req, res) => {
    try {
        const itineraryId = req.params.itinerary_id;
        const updatedItinerary = await flightController.declinePendingFlight(
            itineraryId
        );
        if(updatedItinerary) {
            return sendSuccess(res, "Declined pending flight successfully", {updatedItinerary});
        } else {
            return sendError(res, "Couldn't decline the flight", 400);
        }

    } catch (error) {
        console.error(error);
        return sendError(res, "Couldn't decline the flight", 400);
    }
};

exports.cancelApprovedFlight = async (req, res) => {
    try {
        const itineraryId = req.params.itinerary_id;
        const updatedItinerary = await flightController.cancelApprovedFlight(
            itineraryId
        );
        if(updatedItinerary) {
            return sendSuccess(res, "Cancelled approved flight successfully", {updatedItinerary});
        } else {
            return sendError(res, "Couldn't cancel the flight", 400);
        }
    } catch (error) {
        console.error(error);
        return sendError(res, "Couldn't cancel the flight", 400);
    }
};


exports.getFlightInfo = async (req, res) => {
try {
    const {attendeeId} = req.query;
    //validation
    //TODO add validation

    //run function
    let flightInfo = await flightView.getFlightInfo(attendeeId);
    if(!flightInfo) return sendError(res, "failed to get flight info");
    //return success
    return sendSuccess(res, "successfully got flight information", flightInfo);
} catch (error) {
    console.log(error);
    return sendError(res, "failed to get flight information");
}
};