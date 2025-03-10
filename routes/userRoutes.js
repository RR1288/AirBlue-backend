const express = require("express");
const {getAllEventPlanners} = require("../services/eventPlannerService");
const {registerUserEndUser, registerUserOrganization, disableUserOrganization, disableUserNormalService, updateUserInfo, getAttendees} = require("../services/userService");
const { protect } = require("../middleware/authMiddleware");
const { authorizedRoles } = require("../middleware/roleMiddleware");
const { checkOrganizationUser, checkUserInOrganization, checkUserNotInOrganizaiton } = require("../middleware/organizationMiddleware.js");
const router = express.Router();
const {Roles} = require('../utils/Roles.js');

/**
 * @swagger
 * /users/create-end-user:
 *   post:
 *     summary: create new user for end users who are not organization users
 *     description: endpoint to create new users from the new user screen
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - email
 *               - country
 *               - password
 *             properties:
 *               fname:
 *                 type: string
 *                 example: John
 *               lname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@exple.com
 *               country:
 *                 type: string
 *                 example: USA
 *               city:
 *                 type: string
 *                 example: Keene
 *                 nullable: true
 *               state:
 *                 type: string
 *                 example: NH
 *                 nullable: true
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post('/create-end-user', registerUserEndUser);

/**
 * @swagger
 * /users/create-organization-user:
 *   post:
 *     summary: create new user organization user
 *     description: endpoint for organization admins to create new users
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - country
 *               - password
 *               - organizationID
 *               - roles
 *             properties:
 *               fname:
 *                 type: string
 *                 example: John
 *               lname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test2@exale.com
 *               country:
 *                 type: string
 *                 example: USA
 *               city:
 *                 type: string
 *                 example: Keene
 *                 nullable: true
 *               state:
 *                 type: string
 *                 example: NH
 *                 nullable: true
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               organizationID:
 *                 type: integer
 *                 example: 1
 *               roles:
 *                 type: string
 *                 example: E
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
*/
router.post('/create-organization-user', protect, checkOrganizationUser, authorizedRoles(Roles.ADMIN), registerUserOrganization); //TODO write middleware

/**
 * @swagger
 * /users/event-planners:
 *   get:
 *     summary: Retrieve a list of event planners
 *     description: Fetch all event planners from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved event planners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No event planners found
 *       500:
 *         description: Internal server error
 */

//update functions
/**
 * @swagger
 * /users/updateUserInfo:
 *   post:
 *     summary: takes in input for user info that aren't core to the account or login and updates them
 *     description: endpoint is for basic user update
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fname
 *               - lname
 *               - city
 *               - state
 *               - country
 *               - ktn
 *             properties:
 *               fname:
 *                 type: string
 *                 example: John
 *               lname:
 *                 type: string
 *                 example: Doe
 *               country:
 *                 type: string
 *                 example: USA
 *               city:
 *                 type: string
 *                 example: Keene
 *                 nullable: true
 *               state:
 *                 type: string
 *                 example: NH
 *                 nullable: true
 *               ktn:
 *                 type: string
 *                 example: TT1234567
 *                 nullable: true
 *              
 *     responses:
 *       201:
 *         description: user successfully updated
 *       400:
 *         description: Bad request invalid input
*/
router.post("/updateUserInfo", protect, updateUserInfo);

//get functions
router.get(
    "/event-planners",
    protect,
    authorizedRoles(Roles.ADMIN),
    getAllEventPlanners
);


//user disable functions

/**
 * @swagger
 * /users/disable-user-organization:
 *   post:
 *     summary: disables an organization user
 *     description: endpoint for organization admins to remove users from their organization
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userID
 *             properties:
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
 *       404:
 *         description: User not found
*/
router.post('/disable-user-organization', protect, checkOrganizationUser, authorizedRoles(Roles.ADMIN), checkUserInOrganization, disableUserOrganization);

/**
 * @swagger
 * /users/disable-user-normal:
 *   post:
 *     summary: disables an Attendee user
 *     description: endpoint for attendees
 *     tags:
 *       - Users
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
 *       404:
 *         description: User not found
*/
router.post('/disable-user-normal', protect, checkUserNotInOrganizaiton, disableUserNormalService);

/**
 * @swagger
 * /users/attendees/{eventId}:
 *   get:
 *     summary: Get a list of attendees for an event.
 *     description: Retrieve all attendees for a given event.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: The ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the attendees list
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
 *                   example: Attendees fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "usr_00001"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "johndoe@exmple.com"
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "evt_00001"
 *                           title:
 *                             type: string
 *                             example: "Tech Conference 2025"
 *       400:
 *         description: Bad request - Event ID is required
 *       500:
 *         description: Internal server error
 */
router.get("/attendees/:eventId", protect, getAttendees);



module.exports = router;
