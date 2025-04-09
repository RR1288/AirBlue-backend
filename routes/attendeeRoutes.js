const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer({dest: 'upload/'});
const AttendeeService = require("../services/attendeeService");
const {getAttendeeEvents, getInvitesAttendeee} = require("../services/attendeeService");
const { protect } = require("../middleware/authMiddleware");
const { authorizedRoles } = require("../middleware/roleMiddleware");
const { Roles } = require("../utils/Roles");
const { hasBudget } = require("../middleware/eventMiddleware");

/**
 * @swagger
 * /attendees/invite/{eventId}:
 *   post:
 *     summary: Invite an attendee by email for a given event (Event Planner only).
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
router.post("/invite/:eventId", protect, authorizedRoles(Roles.PLANNER, Roles.PLANNER) , AttendeeService.inviteAttendee);

/**
 * @swagger
 * /attendees/invite-csv:
 *   post:
 *     summary: Invite a group of attendee by email for a given event provided a CSV.
 *     description: |
 *       The system checks if the provided email exists. 
 *       If it does, it sends an invitation link to accept the invitation.
 *       If not, it sends an account creation invitation link.
 *       A pending invitation record is created in either case.
 *     tags:
 *       - Attendees
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: eventGroupId
 *         required: true
 *         description: The ID of the event.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing attendee data.
 *     responses:
 *       200:
 *         description: Invitation sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               properties:
 *                 Email: 
 *                   type: string
 *                   example: "johndoes@example.com"
 *                 FirstName: 
 *                   type: string
 *                   example: "John"
 *                 LastName: 
 *                   type: string
 *                   example: "Doe"
 *                 Success: 
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request – missing required parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/invite-csv", protect, authorizedRoles(Roles.PLANNER, Roles.PLANNER) ,upload.single('file'), AttendeeService.inviteAttendeesCsv);


/**
 * @swagger
 * /attendees/{eventId}:
 *   get:
 *     summary: Get accepted attendees and pending invitations for an event (Event Planner only).
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
 * /attendees/view/getAllEventsAttendeeView:
 *   get:
 *     summary: gets all events that an attendee is in
 *     description: uses the usersID from the users token to query the Attendee table for all occurences 
 *     tags:
 *       - Attendees
 *     responses:
 *       200:
 *         description: a list of events that the user is a part of
 * 
 *       400:
 *         description: userID is invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/view/getAllEventsAttendeeView', protect, getAttendeeEvents);

/**
 * @swagger
 * /attendees/view/getInvitesAttendeeView:
 *   get:
 *     summary: gets all invtes that an attendee has
 *     description: uses the usersID from the users token to query the invtes table for all occurences 
 *     tags:
 *       - Attendees
 *     responses:
 *       200:
 *         description: a list of invtes for events that the user is a part of
 *       400:
 *         description: userID is invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/view/getInvitesAttendeeView', protect, getInvitesAttendeee);

/**
 * @swagger
 * /attendees/invite/revoke:
 *   delete:
 *     summary: Revoke invitations for an event  (Event Planner only).
 *     description: >
 *       An event planner may revoke invitations only if they are assigned to that event.
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
 *               invitationIds:
 *                 type: array
 *                 example: [1, 2, 3]
 *                 items:
 *                   type: integer
 *                 description: "Array of invitation ids to revoke."
 *                  
 *     responses:
 *       200:
 *         description: Invitation revoked successfully.
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
 *                   example: Invitations revoked successfully.
 *       400:
 *         description: Bad request – missing required fields.
 *       403:
 *         description: Unauthorized – not allowed to remove this attendee.
 *       500:
 *         description: Internal server error.
 */
router.delete("/invite/revoke", protect, authorizedRoles(Roles.PLANNER), AttendeeService.revokeInvitations );

/**
 * @swagger
 * /attendees/remove:
 *   delete:
 *     summary: Remove confirmed attendees from an event (Event Planner only).
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
 *               userIds:
 *                 type: array
 *                 example: [9, 10, 11]
 *                 items:
 *                   type: integers
 *                 description: "Array of user IDs to remove from the event."
 *     responses:
 *       200:
 *         description: Attendees removed successfully.
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
 *                   example: Attendees removed successfully.
 *       400:
 *         description: Missing required fields.
 *       403:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.delete("/remove", protect, authorizedRoles(Roles.PLANNER), AttendeeService.removeConfirmedAttendees);

/**
 * @swagger
 * /attendees/cancel:
 *   delete:
 *     summary: Cancel your own pending invitation (End user only).
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
 *     responses:
 *       200:
 *         description: Invitation canceled successfully.
 *       400:
 *         description: Missing required fields.
 *       403:
 *         description: Unauthorized or no pending invitation found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/cancel", protect, AttendeeService.cancelOwnParticipation);

/**
 * @swagger
 * /attendees/update-event-group:
 *   patch:
 *     summary: Update an attendee's event group.
 *     description: Endpoint to update the event group of an attendee.
 *     tags:
 *       - Attendees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendeeId:
 *                 type: integer
 *                 example: 1
 *               eventGroupId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Attendee's event group updated successfully.
 *       400:
 *         description: Invalid input, missing fields, or invalid attendee/event group ID.
 *       404:
 *         description: Attendee not found.
 *       500:
 *         description: Internal server error.
 */



// Define the route to update the attendee's event group
router.patch(
  "/update-event-group", 
  protect, 
  authorizedRoles(Roles.PLANNER), 
  AttendeeService.updateAttendeeEventGroup
);

/**
 * @swagger
 * /attendees/update-event-invite-token:
 *   patch:
 *     summary: Update an attendee's invite post account creation
 *     description: this function is used in the scenario where a user account has just been created through our email workflow
 *     tags:
 *       - Attendees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: adsfbagdbkabgd
 *     responses:
 *       200:
 *         description: Attendee's event group updated successfully.
 *       400:
 *         description: Invalid input, missing fields, or invalid attendee/event group ID.
 *       404:
 *         description: Attendee not found.
 *       500:
 *         description: Internal server error.
 */
router.patch(
  "/update-event-invite-token", //figure out proper middleware for this tommorow
  AttendeeService.updateTokenOnCreation
);

module.exports = router;
