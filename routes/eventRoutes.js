const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const { Roles } = require('../utils/Roles.js');
const { authorizedRoles } = require("../middleware/roleMiddleware.js");
const { checkOrganizationUser } = require("../middleware/organizationMiddleware.js");
const {  createEvent, getAvailableEventTypes } = require("../services/eventService.js");
const EventService = require("../services/eventService");
const { setEventBudget } = require("../services/financeService.js");
const { InEventStaffFinance } = require("../middleware/eventMiddleware.js");

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
 *                 example: 2
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


/**
 * @swagger
 * /events/set-budget:
 *   post:
 *     summary: updates the event budget
 *     description: endpoint to update the event budget
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventID
 *               - totalBudget
 *               - flightBudget
 *             properties:
 *               eventID:
 *                 type: integer
 *                 example: 1
 *               totalBudget:
 *                 type: number
 *                 example: 400000.12
 *               flightBudget:
 *                 type: number
 *                 example: 50000.99
 *               
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post("/set-budget", protect, authorizedRoles(Roles.FINANCE), InEventStaffFinance, checkOrganizationUser, setEventBudget);
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
router.get("/event-types", protect, authorizedRoles(Roles.PLANNER), checkOrganizationUser, getAvailableEventTypes);

/**
 * @swagger
 * /events/event-planners/{eventId}:
 *   get:
 *     summary: Get event planners for a given event.
 *     description: Retrieve a list of event planners (Role 'E') for the specified event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event planners fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event planners fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "usr_001"
 *                       name:
 *                         type: string
 *                         example: "Alice Johnson"
 *                       email:
 *                         type: string
 *                         example: "alice@example.com"
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "evt_001"
 *                           title:
 *                             type: string
 *                             example: "Annual Conference 2025"
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/event-planners/:eventId",
    protect,
    authorizedRoles(Roles.ADMIN),
    EventService.getEventPlanners
);

/**
 * @swagger
 * /events/finance-users/{eventId}:
 *   get:
 *     summary: Get finance users for a given event.
 *     description: Retrieve a list of finance users (Role 'F') for the specified event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Finance users fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Finance users fetched successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "usr_002"
 *                       name:
 *                         type: string
 *                         example: "Bob Smith"
 *                       email:
 *                         type: string
 *                         example: "bob@example.com"
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "evt_001"
 *                           title:
 *                             type: string
 *                             example: "Annual Conference 2025"
 *       400:
 *         description: Bad request – Event ID is required.
 *       500:
 *         description: Internal server error.
 */
router.get(
    "/finance-users/:eventId",
    protect,
    authorizedRoles(Roles.ADMIN),
    EventService.getFinanceUsers
);

/**
 * @swagger
 * /events/invitations/accept:
 *   post:
 *     summary: Accept an event invitation
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: invitation
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation Token received in the invitation link
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid or expired invitation token
 *       500:
 *         description: Internal server error
 */
router.post("/invitations/accept", protect, EventService.acceptInvitation);

module.exports = router;
