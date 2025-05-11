import express from "express";
import {
  applyForRecruitment,
  getApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/recruitment.controller";
import { protect, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../types/roles.types";

const router = express.Router();

/**
 * @swagger
 * /api/recruitment/apply:
 *   post:
 *     summary: Submit recruitment application
 *     tags: [Recruitment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - appliedRole
 *               - experience
 *               - skills
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               appliedRole:
 *                 type: string
 *                 enum: [AVP, Head, Deputy, Officer]
 *               experience:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               resumeUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
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
 *                     appliedRole:
 *                       type: string
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
router.post("/apply", applyForRecruitment);

/**
 * @swagger
 * /api/recruitment/applications:
 *   get:
 *     summary: Get all recruitment applications
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [AVP, Head, Deputy, Officer]
 *         description: Filter by applied role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, shortlisted, interviewed, selected, rejected]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       appliedRole:
 *                         type: string
 *                       experience:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *                       resumeUrl:
 *                         type: string
 *                       status:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
router.get(
  "/applications",
  protect,
  authorize(ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY),
  getApplications
);

/**
 * @swagger
 * /api/recruitment/applications/{id}:
 *   get:
 *     summary: Get a single recruitment application
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application data
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
 *                     phone:
 *                       type: string
 *                     institution:
 *                       type: string
 *                     appliedRole:
 *                       type: string
 *                     experience:
 *                       type: string
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: string
 *                     resumeUrl:
 *                       type: string
 *                     status:
 *                       type: string
 *                     notes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.get(
  "/applications/:id",
  protect,
  authorize(ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY),
  getApplication
);

/**
 * @swagger
 * /api/recruitment/applications/{id}/status:
 *   put:
 *     summary: Update recruitment application status
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shortlisted, interviewed, selected, rejected]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Application status updated successfully
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
 *                     status:
 *                       type: string
 *                       enum: [pending, shortlisted, interviewed, selected, rejected]
 *                     notes:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put(
  "/applications/:id/status",
  protect,
  authorize(ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY),
  updateApplicationStatus
);

/**
 * @swagger
 * /api/recruitment/applications/{id}:
 *   delete:
 *     summary: Delete recruitment application
 *     tags: [Recruitment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application deleted successfully
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
 *                     deleted:
 *                       type: boolean
 */
router.delete(
  "/applications/:id",
  protect,
  authorize(ROLES.PRESIDENT, ROLES.VP, ROLES.AVP, ROLES.HEAD, ROLES.DEPUTY),
  deleteApplication
);

export default router;
