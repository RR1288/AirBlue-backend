const express = require("express");
const flightService = require("../services/flightService.js");
const {authorizedRoles} = require("../middleware/roleMiddleware.js");
const {Roles} = require("../utils/Roles.js");
const {protect} = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 * /flights/create-request:
 *   get:
 *     summary: Retrieve a list of flights
 *     description: Creates an offer request based on origin, destination, and departure date using the Duffel API.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: IATA code of the origin airport (e.g., LHR for London Heathrow)
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         required: true
 *         description: IATA code of the destination airport (e.g., JFK for John F. Kennedy International Airport)
 *       - in: query
 *         name: departureDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Departure date in YYYY-MM-DD format
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Return date in YYYY-MM-DD format
 *       - in: query
 *         name: cabinClass
 *         schema:
 *           type: string
 *           enum: [economy, premium_economy, business, first]
 *         required: false
 *         description: Cabin class for the flight (default is economy)
 *     responses:
 *       200:
 *         description: Successfully retrieved flight offers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing required query parameters
 *       500:
 *         description: Failed to fetch flights
 */
router.get(
    "/create-request",
    protect,
    flightService.createRequest
);

/**
 * @swagger
 * /flights/offers:
 *   get:
 *     summary: Retrieve Duffel flight offers
 *     description: Fetches flight offers using Duffel's API based on the offer_request_id and a specified limit.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: offer_request_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Duffel offer request ID.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Maximum number of offers to retrieve.
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         required: false
 *         description: Pagination cursor to get the next page of offers.
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         required: false
 *         description: Pagination cursor to get the previous page of offers.
 *     responses:
 *       200:
 *         description: Successfully retrieved offers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing or invalid parameters.
 *       500:
 *         description: Failed to fetch offers.
 */
router.get("/offers", protect, flightService.getOffers);

/**
 * @swagger
 * /flights/{offer_id}:
 *   get:
 *     summary: Retrieve specific flight details
 *     description: Fetch detailed information about a specific flight offer from Duffel.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: path
 *         name: offer_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flight offer to retrieve.
 *     responses:
 *       200:
 *         description: Flight offer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offer:
 *                   type: object
 *                   description: The detailed flight offer information.
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Flight offer not found
 *       500:
 *         description: Internal server error
 */

router.get("/:offer_id", protect, flightService.fetchFlight);

/**
 * @swagger
 * /flights/{offer_id}/hold:
 *   post:
 *     description: Hold a specific flight offer. Returns order ID.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: path
 *         name: offer_id
 *         required: true
 *         description: The ID of the offer to book or hold
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               passengers:
 *                 type: array
 *                 description: List of passengers
 *                 items:
 *                   type: object
 *                   properties:
 *                     phone_number:
 *                       type: string
 *                       example: "+442080160508"
 *                     email:
 *                       type: string
 *                       example: "tony@exmple.com"
 *                     born_on:
 *                       type: string
 *                       format: date
 *                       example: "1980-07-24"
 *                     title:
 *                       type: string
 *                       example: "mr"
 *                     gender:
 *                       type: string
 *                       example: "m"
 *                     family_name:
 *                       type: string
 *                       example: "Stark"
 *                     given_name:
 *                       type: string
 *                       example: "Tony"
 *                     id:
 *                       type: string
 *                       example: "pas_0000ArlFyquQxuoVMa7UZE"
 *     responses:
 *       200:
 *         description: Successfully held the offer
 *       400:
 *         description: Invalid request or failed to hold offer
 *       500:
 *         description: Internal server error
 */
router.post("/:offer_id/hold", protect, flightService.holdOffer);

/**
 * @swagger
 * /flights/{order_id}/book:
 *   post:
 *     description: Pay an order in hold.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         description: The ID of the order to pay
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully booked the offer
 *       400:
 *         description: Invalid request or failed to book offer
 *       500:
 *         description: Internal server error
 */
router.post(
    "/:order_id/book",
    protect,
    authorizedRoles(Roles.PLANNER),
    flightService.bookFlight
);

/**
 * @swagger
 * /flights/{itinerary_id}/declinePendingFlight:
 *   post:
 *     summary: Decline a pending flight itinerary and cancel on Duffel if applicable
 *     description: Decline a flight itinerary that is currently pending. This endpoint will update the itinerary locally and cancel the booking in Duffel. Only event planners are allowed.
 *     parameters:
 *       - in: path
 *         name: itinerary_id
 *         description: The itinerary ID.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The itinerary has been successfully declined and cancelled on Duffel.
 *       400:
 *         description: Bad request (e.g. itinerary is not pending or cancellation fails).
 */
router.post(
    "/:itinerary_id/declinePendingFlight",
    protect,
    authorizedRoles(Roles.PLANNER),
    flightService.declinePendingFlight
);

/**
 * @swagger
 * /flights/{itinerary_id}/cancelApprovedFlight:
 *   post:
 *     summary: Cancel an approved flight itinerary in both local DB and Duffel
 *     description: Cancel a flight itinerary that has been approved (and paid) by updating the local status and cancelling the booking in Duffel. Only event planners are allowed.
 *     parameters:
 *       - in: path
 *         name: itinerary_id
 *         description: The itinerary ID.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The itinerary has been successfully cancelled.
 *       400:
 *         description: Bad request (e.g. itinerary is not approved or cancellation fails).
 */
router.post(
    "/:itinerary_id/cancelApprovedFlight",
    protect,
    authorizedRoles(Roles.PLANNER),
    flightService.cancelApprovedFlight
);


/**
 * @swagger
 * /flights/view/getFlightInfo:
 *   get:
 *     summary: Retrieve specific flight details
 *     description: Fetch detailed information about a specific flight offer from the database.
 *     tags:
 *       - Flights
 *     parameters:
 *       - in: query
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the flight offer to retrieve.
 *     responses:
 *       200: 
 *         description: the users itinerary and all related 
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get(
"/view/getFlightInfo",
protect,
flightService.getFlightInfo
);

module.exports = router;
