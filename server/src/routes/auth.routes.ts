import express from "express";
import {
  login,
  verifyMfa,
  getMe,
  setupMfa,
  disableMfa,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const AuthRoutes = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful or MFA required
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         mfaEnabled:
 *                           type: boolean
 *                 - type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                     mfaRequired:
 *                       type: boolean
 *                     userId:
 *                       type: string
 */
AuthRoutes.post("/login", login);

/**
 * @swagger
 * /api/auth/verify-mfa:
 *   post:
 *     summary: Verify MFA code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA verification successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     mfaEnabled:
 *                       type: boolean
 */
AuthRoutes.post("/verify-mfa", verifyMfa);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     supervisor:
 *                       type: string
 *                     subordinates:
 *                       type: array
 *                       items:
 *                         type: string
 *                     mfaEnabled:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
AuthRoutes.get("/me", protect, getMe);

/**
 * @swagger
 * /api/auth/setup-mfa:
 *   post:
 *     summary: Setup MFA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA setup data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     secret:
 *                       type: string
 *                     qrCode:
 *                       type: string
 */
AuthRoutes.post("/setup-mfa", protect, setupMfa);

/**
 * @swagger
 * /api/auth/disable-mfa:
 *   post:
 *     summary: Disable MFA
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
AuthRoutes.post("/disable-mfa", protect, disableMfa);

export default AuthRoutes;
