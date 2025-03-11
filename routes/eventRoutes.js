const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const { Roles } = require('../utils/Roles.js');
const { authorizedRoles } = require("../middleware/roleMiddleware.js");
const { checkOrganizationUser } = require("../middleware/organizationMiddleware.js");
const {  createEvent, getAvailableEventTypes } = require("../services/eventService.js");
/**
 * @swagger
 * /events/create-event:
 *   post:
 *     summary: create a new event for your organization
 *     description: endpoint to create new event in your organization
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - endDate
 *               - typeID
 *             properties:
 *               name:
 *                 type: string
 *                 example: board of directors meeting
 *               startDate:
 *                 type: string
 *                 example: 2025-05-23
 *               endDate:
 *                 type: string
 *                 example: 2025-05-26
 *               typeID:
 *                 type: integer
 *                 example: 4
 *               description:
 *                 type: string
 *                 example: meeting to discuss current finances with the board of directors
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post('/create-event', protect, authorizedRoles(Roles.PLANNER), checkOrganizationUser,  createEvent);


//get methods

/**
 * @swagger
 * /events/event-types:
 *   get:
 *     summary: Retrieve a list of event types avaiable to you
 *     description: Fetch all event planners from the database.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Successfully retrieved event types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       404:
 *         description: No event planners found
 *       500:
 *         description: Internal server error
 */
router.get("/event-types", protect, authorizedRoles(Roles.ADMIN), checkOrganizationUser, getAvailableEventTypes);

module.exports = router;