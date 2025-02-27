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
    authorizedRoles(Roles.ADMIN, Roles.PLANNER, Roles.FINANCE),
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
router.get("/offers", flightService.getOffers);

module.exports = router;
