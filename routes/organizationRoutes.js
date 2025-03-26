const express = require("express");
const router = express.Router();
const {getOrganizationInfo, getOrganizationUsers}= require("../services/organizationService.js");
const {authorizedRoles} = require("../middleware/roleMiddleware.js");
const {Roles} = require("../utils/Roles.js");
const {protect} = require("../middleware/authMiddleware.js");

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