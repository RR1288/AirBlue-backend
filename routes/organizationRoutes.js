const express = require("express");
const router = express.Router();
const {getOrganizationInfo, getOrganizationUsers, createOrganization}= require("../services/organizationService.js");
const {authorizedRoles} = require("../middleware/roleMiddleware.js");
const {Roles} = require("../utils/Roles.js");
const {protect} = require("../middleware/authMiddleware.js");
const { checkUserNotInOrganizaiton } = require("../middleware/organizationMiddleware.js");


/**
 * @swagger
 * /organizations/createOrganization:
 *   post:
 *     summary: given a userId from the users token it should allow for the creation of an organization with a default user
 *     description: endpoint to create new organization. In a future release this endpoint will need to include payments and many more middleware functions as part of unboarding
 *     tags:
 *       - Organizations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: unclear dyanmics
 *               description:
 *                 type: string
 *                 example: an organization that is responsible for managing opensource ttrpg books
 *     responses:
 *       201:
 *         description: organization successfully created
 *       400:
 *         description: Bad request invalid input
 */
router.post("/createOrganization",protect,checkUserNotInOrganizaiton ,createOrganization);



//get endpoints

/**
 * @swagger
 * /organizations/getOrganizationUsers:
 *   get:
 *     summary: gets a list of all organization users in your organization
 *     description: uses the users token with their organizationID in order to get all users in that organization
 *     tags:
 *       - Organizations
 *     responses:
 *       200:
 *         description: A list of all organization users along with their roles
 *       400:
 *         description: uorganizationId is invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/getOrganizationUsers", protect, getOrganizationUsers);

/**
 * @swagger
 * /organizations/getOrganizationInfo:
 *   get:
 *     summary: gets a list of all organization users in your organization
 *     description: uses the users token with their organizationID in order to get all users in that organization
 *     tags:
 *       - Organizations
 *     responses:
 *       200:
 *         description: A list of all organization users along with their roles
 *       400:
 *         description: uorganizationId is invalid.
 *       500:
 *         description: Internal server error.
 */
router.get('/getOrganizationInfo', protect, getOrganizationInfo);


module.exports = router;