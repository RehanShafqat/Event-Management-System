import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  cancelMeeting,
  deleteMeeting,
} from "../controllers/meeting.controller";
import { protect, authorize } from "../middleware/auth.middleware";
import { Role } from "../types/user.types";

const router = express.Router();

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dateTime
 *               - location
 *               - attendeeRoles
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               attendeeRoles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [VP, AVP, Head, Deputy, Officer]
 *               agenda:
 *                 type: string
 *     responses:
 *       201:
 *         description: Meeting created successfully
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
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                     location:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [scheduled, ongoing, completed, cancelled]
 *                     organizer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     attendees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                     agenda:
 *                       type: string
 *                     minutes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  "/",
  protect,
  authorize("President", "VP", "AVP", "Head", "Deputy" as Role),
  createMeeting
);

/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: Get all meetings
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, ongoing, completed, cancelled]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of meetings
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
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       dateTime:
 *                         type: string
 *                         format: date-time
 *                       location:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [scheduled, ongoing, completed, cancelled]
 *                       organizer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       attendees:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                       agenda:
 *                         type: string
 *                       minutes:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/", protect, getMeetings);

/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Get a meeting by ID
 *     tags: [Meetings]
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
 *         description: Meeting data
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
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                     location:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [scheduled, ongoing, completed, cancelled]
 *                     organizer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     attendees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                     agenda:
 *                       type: string
 *                     minutes:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.get("/:id", protect, getMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   put:
 *     summary: Update a meeting
 *     tags: [Meetings]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [scheduled, ongoing, completed, cancelled]
 *               minutes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meeting updated successfully
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
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                     location:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [scheduled, ongoing, completed, cancelled]
 *                     minutes:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put("/:id", protect, updateMeeting);

/**
 * @swagger
 * /api/meetings/{id}/cancel:
 *   put:
 *     summary: Cancel a meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meeting cancelled successfully
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
 *                       enum: [cancelled]
 *                     cancellationReason:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put("/:id/cancel", protect, cancelMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Meetings]
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
 *         description: Meeting deleted successfully
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
router.delete("/:id", protect, authorize("President" as Role), deleteMeeting);

export default router;
