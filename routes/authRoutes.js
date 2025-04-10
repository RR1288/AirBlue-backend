const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, protectOnSetup } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful or 2FA required
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the user and revoke the refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/logout", protect, authController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using the refresh token
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: New access token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", authController.refreshToken);

/**
 * @swagger
 * /auth/2fa/setup:
 *   post:
 *     summary: Setup 2FA for the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup successful, returns QR code
 */
router.post("/2fa/setup", protectOnSetup, authController.setup2FA);

/**
 * @swagger
 * /auth/2fa/verify:
 *   post:
 *     summary: Verify the 2FA TOTP code for the authenticated user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               twoFactorCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA verification successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: 
 *                   type: string
 *                   description: Short-lived JWT token
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token
 *             schema:
 *               type: string
 *               example: refreshToken=<token>
 *       400:
 *         description: Invalid 2FA token
 *       404:
 *         description: User not found or 2FA not enabled
 */
router.post("/2fa/verify", authController.verify2FA);

/**
 * @swagger
 * /auth/2fa/disable:
 *   post:
 *     summary: Disable 2FA for the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 */
router.post("/2fa/disable", protect, authController.disable2FA);




module.exports = router;