import express from "express";
import {
  createCompetition,
  getCompetitions,
  getCompetition,
  updateCompetition,
  deleteCompetition,
  assignStaffToCompetition,
  removeStaffFromCompetition,
  registerTeam,
  confirmTeamPayment,
  getCompetitionRegistrations,
  addCompetitionResult,
  getCompetitionResults,
  getCompetitionParticipants,
  getCompetitionTeams,
  getPublicCompetitions,
  getPublicCompetitionById,
} from "../controllers/competition.controller";
import { protect, authorize } from "../middleware/auth.middleware";
import { Role } from "../types/user.types";

const router = express.Router();

/**
 * @swagger
 * /api/competitions/public:
 *   get:
 *     summary: Get all competitions for public view
 *     tags: [Competitions]
 *     responses:
 *       200:
 *         description: List of competitions with basic information
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
 *                       description:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       registrationFee:
 *                         type: number
 *                       winnerPrize:
 *                         type: number
 *                       runnerUpPrize:
 *                         type: number
 *                       registrationDeadline:
 *                         type: string
 *                         format: date-time
 *                       eventDate:
 *                         type: string
 *                         format: date-time
 *                       venue:
 *                         type: string
 *                       maxParticipantsPerTeam:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [upcoming, ongoing, completed]
 *                       head:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 */
router.get("/public", getPublicCompetitions);

/**
 * @swagger
 * /api/competitions/public/{id}:
 *   get:
 *     summary: Get a single competition for public view
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Competition data with basic information
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
 *                     description:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     registrationFee:
 *                       type: number
 *                     winnerPrize:
 *                       type: number
 *                     runnerUpPrize:
 *                       type: number
 *                     registrationDeadline:
 *                       type: string
 *                       format: date-time
 *                     eventDate:
 *                       type: string
 *                       format: date-time
 *                     venue:
 *                       type: string
 *                     maxParticipantsPerTeam:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [upcoming, ongoing, completed]
 *                     head:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 */
router.get("/public/:id", getPublicCompetitionById);

/**
 * @swagger
 * /api/competitions:
 *   post:
 *     summary: Create a new competition
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - registrationFee
 *               - registrationDeadline
 *               - eventDate
 *               - venue
 *               - maxParticipantsPerTeam
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               registrationFee:
 *                 type: number
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               venue:
 *                 type: string
 *               maxParticipantsPerTeam:
 *                 type: number
 *               avpId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Competition created successfully
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
 *                     description:
 *                       type: string
 *                     registrationFee:
 *                       type: number
 *                     registrationDeadline:
 *                       type: string
 *                       format: date-time
 *                     eventDate:
 *                       type: string
 *                       format: date-time
 *                     venue:
 *                       type: string
 *                     maxParticipantsPerTeam:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [upcoming, ongoing, completed]
 *                     avp:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  "/",
  protect,
  authorize("President", "VP", "AVP" as Role),
  createCompetition
);

/**
 * @swagger
 * /api/competitions:
 *   get:
 *     summary: Get all competitions
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, completed]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of competitions
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
 *                       description:
 *                         type: string
 *                       registrationFee:
 *                         type: number
 *                       registrationDeadline:
 *                         type: string
 *                         format: date-time
 *                       eventDate:
 *                         type: string
 *                         format: date-time
 *                       venue:
 *                         type: string
 *                       maxParticipantsPerTeam:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [upcoming, ongoing, completed]
 *                       avp:
 *                         type: string
 *                       heads:
 *                         type: array
 *                         items:
 *                           type: string
 *                       deputies:
 *                         type: array
 *                         items:
 *                           type: string
 *                       officers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/", protect, getCompetitions);

/**
 * @swagger
 * /api/competitions/{id}:
 *   get:
 *     summary: Get a competition by ID
 *     tags: [Competitions]
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
 *         description: Competition data
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
 *                     description:
 *                       type: string
 *                     registrationFee:
 *                       type: number
 *                     registrationDeadline:
 *                       type: string
 *                       format: date-time
 *                     eventDate:
 *                       type: string
 *                       format: date-time
 *                     venue:
 *                       type: string
 *                     maxParticipantsPerTeam:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [upcoming, ongoing, completed]
 *                     avp:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     heads:
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
 *                     deputies:
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
 *                     officers:
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
 *                     registrations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           teamName:
 *                             type: string
 *                           teamMembers:
 *                             type: array
 *                             items:
 *                               type: string
 *                           paymentStatus:
 *                             type: string
 *                             enum: [pending, confirmed]
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           teamName:
 *                             type: string
 *                           position:
 *                             type: number
 *                           score:
 *                             type: number
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.get("/:id", protect, getCompetition);

/**
 * @swagger
 * /api/competitions/{id}:
 *   put:
 *     summary: Update a competition
 *     tags: [Competitions]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               registrationFee:
 *                 type: number
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *               eventDate:
 *                 type: string
 *                 format: date-time
 *               venue:
 *                 type: string
 *               maxParticipantsPerTeam:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [upcoming, ongoing, completed]
 *     responses:
 *       200:
 *         description: Competition updated successfully
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
 *                     description:
 *                       type: string
 *                     registrationFee:
 *                       type: number
 *                     registrationDeadline:
 *                       type: string
 *                       format: date-time
 *                     eventDate:
 *                       type: string
 *                       format: date-time
 *                     venue:
 *                       type: string
 *                     maxParticipantsPerTeam:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [upcoming, ongoing, completed]
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put(
  "/:id",
  protect,
  authorize("President", "VP", "AVP" as Role),
  updateCompetition
);

/**
 * @swagger
 * /api/competitions/{id}:
 *   delete:
 *     summary: Delete a competition
 *     tags: [Competitions]
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
 *         description: Competition deleted successfully
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
  "/:id",
  protect,
  authorize("President", "VP" as Role),
  deleteCompetition
);

/**
 * @swagger
 * /api/competitions/{id}/assign-staff:
 *   put:
 *     summary: Assign staff to a competition
 *     tags: [Competitions]
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
 *               - staffId
 *               - role
 *             properties:
 *               staffId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Head, Deputy, Officer]
 *     responses:
 *       200:
 *         description: Staff assigned successfully
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
 *                     staffId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put(
  "/:id/assign-staff",
  protect,
  authorize("President", "VP", "AVP", "Head" as Role),
  assignStaffToCompetition
);

/**
 * @swagger
 * /api/competitions/{id}/remove-staff:
 *   put:
 *     summary: Remove staff from a competition
 *     tags: [Competitions]
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
 *               - staffId
 *               - role
 *             properties:
 *               staffId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Head, Deputy, Officer]
 *     responses:
 *       200:
 *         description: Staff removed successfully
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
 *                     staffId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put(
  "/:id/remove-staff",
  protect,
  authorize("President", "VP", "AVP", "Head" as Role),
  removeStaffFromCompetition
);

/**
 * @swagger
 * /api/competitions/{id}/register:
 *   post:
 *     summary: Register a team for a competition
 *     tags: [Competitions]
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
 *               - teamName
 *               - participants
 *             properties:
 *               teamName:
 *                 type: string
 *                 description: Name of the team
 *               participants:
 *                 type: array
 *                 description: Array of team participants
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - email
 *                     - phone
 *                     - institution
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Full name of the participant
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: Email address of the participant
 *                     phone:
 *                       type: string
 *                       description: Phone number of the participant
 *                     institution:
 *                       type: string
 *                       description: Institution/University of the participant
 *     responses:
 *       201:
 *         description: Team registered successfully
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
 *                     registration:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         teamName:
 *                           type: string
 *                         participants:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               phone:
 *                                 type: string
 *                               institution:
 *                                 type: string
 *                         paymentStatus:
 *                           type: string
 *                           enum: [pending, confirmed, rejected]
 *                         registrationDate:
 *                           type: string
 *                           format: date-time
 *                     bankDetails:
 *                       type: object
 *                       properties:
 *                         accountName:
 *                           type: string
 *                         accountNumber:
 *                           type: string
 *                         bankName:
 *                           type: string
 *                         reference:
 *                           type: string
 *                         amount:
 *                           type: number
 *                     message:
 *                       type: string
 */
router.post("/:id/register", registerTeam);

/**
 * @swagger
 * /api/competitions/registrations/{id}/confirm-payment:
 *   put:
 *     summary: Confirm team payment
 *     tags: [Competitions]
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
 *               - teamId
 *             properties:
 *               teamId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
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
 *                     teamName:
 *                       type: string
 *                     paymentStatus:
 *                       type: string
 *                       enum: [confirmed]
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.put(
  "/registrations/:id/confirm-payment",
  protect,
  authorize("President", "VP", "AVP" as Role),
  confirmTeamPayment
);

/**
 * @swagger
 * /api/competitions/{id}/registrations:
 *   get:
 *     summary: Get competition registrations
 *     tags: [Competitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, confirmed]
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: List of registrations
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
 *                       teamName:
 *                         type: string
 *                       teamMembers:
 *                         type: array
 *                         items:
 *                           type: string
 *                       paymentStatus:
 *                         type: string
 *                         enum: [pending, confirmed]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/:id/registrations", protect, getCompetitionRegistrations);

/**
 * @swagger
 * /api/competitions/{id}/results:
 *   post:
 *     summary: Add competition results
 *     tags: [Competitions]
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
 *               - teamId
 *               - position
 *               - score
 *             properties:
 *               teamId:
 *                 type: string
 *               position:
 *                 type: number
 *               score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Results added successfully
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
 *                     teamName:
 *                       type: string
 *                     position:
 *                       type: number
 *                     score:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 */
router.post(
  "/:id/results",
  protect,
  authorize("President", "VP", "AVP", "Head" as Role),
  addCompetitionResult
);

/**
 * @swagger
 * /api/competitions/{id}/results:
 *   get:
 *     summary: Get competition results
 *     tags: [Competitions]
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
 *         description: List of results
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
 *                       teamName:
 *                         type: string
 *                       position:
 *                         type: number
 *                       score:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get("/:id/results", protect, getCompetitionResults);

// Get competition participants
router.get("/:id/participants", protect, getCompetitionParticipants);

/**
 * @swagger
 * /api/competitions/{id}/teams:
 *   get:
 *     summary: Get all teams registered for a competition
 *     tags: [Competitions]
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
 *         description: List of registered teams
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
 *                       teamName:
 *                         type: string
 *                       participants:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             phone:
 *                               type: string
 *                             institution:
 *                               type: string
 *                       paymentStatus:
 *                         type: string
 *                         enum: [pending, confirmed, rejected]
 *                       registrationDate:
 *                         type: string
 *                         format: date-time
 *                       confirmedBy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 */
router.get("/:id/teams", protect, getCompetitionTeams);

export default router;
