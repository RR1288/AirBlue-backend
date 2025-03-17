const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");

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
router.post("/2fa/setup", protect, authController.setup2FA);

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
