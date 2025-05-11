import express from "express";
import {
  getCompetitions,
  getCompetitionById,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  getPublicCompetitions,
  getPublicCompetitionById,
} from "../controllers/competitionController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes (no authentication required)
router.get("/public", getPublicCompetitions);
router.get("/public/:id", getPublicCompetitionById);

// Protected routes (authentication required)
router.get("/", authenticateToken, getCompetitions);
router.get("/:id", authenticateToken, getCompetitionById);
router.post("/", authenticateToken, createCompetition);
router.put("/:id", authenticateToken, updateCompetition);
router.delete("/:id", authenticateToken, deleteCompetition);

export default router;
