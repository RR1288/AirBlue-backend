const express = require("express");
const router = express.Router();
const AttendeeService = require("../services/attendeeService");
const { protect } = require("../middleware/authMiddleware");
const { authorizedRoles } = require("../middleware/roleMiddleware");
const { Roles } = require("../utils/Roles");

/**
 * @swagger
 * /attendees/invite/{eventId}:
 *   post:
 *     summary: Invite an attendee by email for a given event.
 *     description: |
 *       The system checks if the provided email exists. 
 *       If it does, it sends an invitation link to accept the invitation.
 *       If not, it sends an account creation invitation link.
 *       A pending invitation record is created in either case.
 *     tags:
 *       - Attendees
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "invitee@example.com"
 *               eventGroupId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Invitation sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invitationId:
 *                   type: integer
 *                   example: 1
 *                 invitedEmail:
 *                   type: string
 *                   example: "invitee@example.com"
 *                 status:
 *                   type: string
 *                   example: "pending"
 *       400:
 *         description: Bad request – missing required parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/invite/:eventId", protect, authorizedRoles(Roles.PLANNER, Roles.PLANNER), AttendeeService.inviteAttendee);

/**
 * @swagger
 * /attendees/{eventId}:
 *   get:
 *     summary: Get accepted attendees and pending invitations for an event.
 *     description: |
 *       Returns two lists:
 *         - Attendees: Users who have accepted the invitation (with full user info).
 *         - Pending Invitations: Invitations that are pending, without revealing if the user exists.
 *     tags:
 *       - Attendees
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendees and pending invitations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       name:
 *                         type: string
 *                         example: "Alice Johnson"
 *                       email:
 *                         type: string
 *                         example: "alice@example.com"
 *                 pendingInvitations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       invitationId:
 *                         type: integer
 *                         example: 6
 *                       invitedEmail:
 *                         type: string
 *                         example: "invitee@example.com"
 *                       status:
 *                         type: string
 *                         example: "pending"
 *       400:
 *         description: Bad request – missing event ID.
 *       500:
 *         description: Internal server error.
 */
router.get("/:eventId", protect, authorizedRoles(Roles.PLANNER, Roles.ADMIN), AttendeeService.getAttendees);


/**
 * @swagger
 * /attendees/remove:
 *   delete:
 *     summary: Remove an attendee from an event.
 *     description: >
 *       An attendee can only remove themselves from an event.
 *       An event planner may remove an attendee only if they are assigned to that event.
 *       An admin may remove an attendee only if the event belongs to their organization.
 *     tags:
 *       - Attendees
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 11
 *                 description: >
 *                   Optional. For planners or admins: the ID of the attendee to remove.
 *                   If omitted, the authenticated user is assumed.
 *     responses:
 *       200:
 *         description: Attendee removed successfully.
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
 *                   example: Attendee removed successfully.
 *       400:
 *         description: Bad request – missing required fields.
 *       403:
 *         description: Unauthorized – not allowed to remove this attendee.
 *       500:
 *         description: Internal server error.
 */
router.delete("/remove", protect, AttendeeService.removeAttendee); // TODO: Restrict access from Finance Planners


module.exports = router;
