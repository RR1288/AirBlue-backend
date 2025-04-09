const express = require("express");
const router = express.Router();
const {getOrganizationInfo, getOrganizationUsers, createOrganization, updateOrganization, addRoleUserOrganization, deleteOrganization} = require("../services/organizationService.js");
const {authorizedRoles} = require("../middleware/roleMiddleware.js");
const {Roles} = require("../utils/Roles.js");
const {protect} = require("../middleware/authMiddleware.js");
const { checkUserNotInOrganizaiton, checkUserInOrganization} = require("../middleware/organizationMiddleware.js");


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

/**
 * @swagger
 * /organizations/updateOrganization:
 *   patch:
 *     summary: Update an organization's name or description
 *     description: This endpoint allows updating an organization's name or description, where either or both can be modified by providing them in the request body.
 *     tags:
 *       - Organizations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Organization Name
 *               description:
 *                 type: string
 *                 example: Updated Description for the organization
 *     responses:
 *       200:
 *         description: Organization successfully updated
 *       400:
 *         description: Bad request invalid input
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
router.patch("/updateOrganization", protect, updateOrganization);

/**
 * @swagger
 * /organizations/addRoleUserOrganization:
 *   patch:
 *     summary: Add a role to a user's organization
 *     description: This endpoint allows an admin or authorized user to add a specific role (A, F, or E) to a user in an organization.
 *     tags:
 *       - Organizations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 2
 *               role:
 *                 type: string
 *                 enum: [A, F, E]
 *                 example: A
 *     responses:
 *       200:
 *         description: Role successfully added to user organization
 *       400:
 *         description: Invalid request data or userId not valid
 *       404:
 *         description: User or organization not found
 *       500:
 *         description: Internal server error
 */
router.patch("/addRoleUserOrganization", protect, authorizedRoles(Roles.ADMIN), addRoleUserOrganization);

/**
 * @swagger
 * /organizations/deleteOrganization:
 *   delete:
 *     summary: Deletes the organization that the user is currently part of
 *     description: This endpoint deletes the organization that the authenticated user is a part of.
 *     tags:
 *       - Organizations
 *     responses:
 *       200:
 *         description: Organization successfully deleted
 *       400:
 *         description: User is not associated with any active organization
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteOrganization', protect, authorizedRoles(Roles.ADMIN), deleteOrganization);


module.exports = router;