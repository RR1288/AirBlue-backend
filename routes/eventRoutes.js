const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {authorizedRoles} = require("../middleware/roleMiddleware");
const {Roles} = require("../utils/Roles.js");
const EventService = require("../services/eventService");

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
