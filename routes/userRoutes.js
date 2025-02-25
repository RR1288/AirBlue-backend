const express = require("express");
const {getAllEventPlanners} = require("../services/eventPlannerService");
const {registerUser} = require("../services/userService");
const { protect } = require("../middleware/authMiddleware");
const { authorizedRoles } = require("../middleware/roleMiddleware");
const router = express.Router();
const {Roles} = require('../utils/Roles.js');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetch all users from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
//router.get("/", protect, authorizedRoles(Roles.ADMIN), registerUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user
 *         userName:
 *           type: string
 *           description: The user's username
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         city:
 *           type: string
 *           description: The user's city
 *         state:
 *           type: string
 *           description: The user's state
 *         country:
 *           type: string
 *           description: The user's country
 *         email:
 *           type: string
 *           description: The user's email address
 *       required:
 *         - id
 *         - userName
 *         - firstName
 *         - lastName
 *         - email
 *         - city
 *         - state
 *         - country
 *     EventPlannerList:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/User'
 *       description: A list of event planners
 */

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
router.get("/event-planners", protect, authorizedRoles(Roles.ADMIN), getAllEventPlanners);

module.exports = router;
