const express = require("express");
const {getAllEventPlanners} = require("../services/eventPlannerService");
const {registerUserEndUser, registerUserOrganization} = require("../services/userService");
const { protect } = require("../middleware/authMiddleware");
const { authorizedRoles } = require("../middleware/roleMiddleware");
const router = express.Router();
const {Roles} = require('../utils/Roles.js');



/**
 * @swagger
 * /users/create-end-user
 *   post:
 *     summary: create new user for end users who are not organization users
 *     description: endpoint to create new users from the new user screen
 *     tags
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
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               Country:
 *                 type: string
 *                 example: USA
 *               City:
 *                 type: string
 *                 example: Keene
 *                 nullable: true
 *               State:
 *                 type: string
 *                 example: NH
 *                 nullable: true
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
*/
router.post('/create-end-user', registerUserEndUser);
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
