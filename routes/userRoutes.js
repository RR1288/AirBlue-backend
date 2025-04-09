const express = require("express");
const {getAllEventPlanners} = require("../services/eventPlannerService");
const {
    registerUserEndUser,
    registerUserOrganization,
    disableUserOrganization,
    disableUserNormalService,
    updateUserInfo,
    updatePasswordAdmin,
    sendResetEmailBasic,
    resetPassword,
    getUserInfo
} = require("../services/userService");
const {protect} = require("../middleware/authMiddleware");
const {authorizedRoles} = require("../middleware/roleMiddleware");
const {
    checkOrganizationUser,
    checkUserInOrganization,
    checkUserNotInOrganizaiton,
} = require("../middleware/organizationMiddleware.js");
const router = express.Router();
const {Roles} = require("../utils/Roles.js");
const { updateExpression } = require("@babel/types");
const { updatePassword } = require("../controllers/userController.js");

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
router.post("/create-end-user", registerUserEndUser);

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
 *               roles:
 *                 type: string
 *                 example: E
 *     responses:
 *       201:
 *         description: user successfully created
 *       400:
 *         description: Bad request invalid input
 */
router.post(
    "/create-organization-user",
    protect,
    checkOrganizationUser,
    authorizedRoles(Roles.ADMIN),
    registerUserOrganization
); //TODO write middleware

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

/**
 * @swagger
 * /users/send-reset-email:
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@exple.com
 *     responses:
 *       201:
 *         description: email was successfully sent
 *       400:
 *         description: function was not succefully run
 */
router.post("/send-reset-email", sendResetEmailBasic);

/**
 * @swagger
 * /users/reset-password-admin :
 *   post:
 *     summary: reset and organization users password as an administrative user for an organization
 *     description: reset and organization users password as an administrative user for an organization
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
 *               - password
 *             properties:
 *               userID:
 *                 type: integer
 *                 example: 2
 *               password:
 *                 type: string
 *                 example: securepassword123!
 *  
 *     responses:
 *       201:
 *         description: email was successfully sent
 *       400:
 *         description: function was not succefully run
 */
router.post("/reset-password-admin", protect, checkOrganizationUser, checkUserInOrganization, updatePasswordAdmin); //this function should later be shifted to actually changing the pa

/**
 * @swagger
 * /users/reset-password:
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
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *     responses:
 *       201:
 *         description: email was successfully sent
 *       400:
 *         description: function was not succefully run
 */
router.post("/reset-password", protect, resetPassword);

//get functions
router.get(
    "/event-planners",
    protect,
    authorizedRoles(Roles.ADMIN),
    getAllEventPlanners
);

/**
 * @swagger
 * /users/getUserInfo:
 *   get:
 *     summary: gets all events invitees for an event that an event planner is in
 *     description: uses a passed in event ID to get a list of all invited individuals
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: the users information
 *       400:
 *         description: userID is invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/getUserInfo", protect, getUserInfo);
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
router.post(
    "/disable-user-organization",
    protect,
    checkOrganizationUser,
    authorizedRoles(Roles.ADMIN),
    checkUserInOrganization,
    disableUserOrganization
);

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
router.post(
    "/disable-user-normal",
    protect,
    checkUserNotInOrganizaiton,
    disableUserNormalService
);

module.exports = router;
