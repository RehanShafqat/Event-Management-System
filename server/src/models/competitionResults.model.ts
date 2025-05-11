import mongoose, { Schema } from "mongoose";
import { ICompetitionResult } from "../types/competitionTypes";

const CompetitionResultSchema: Schema = new Schema(
  {
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Please specify the competition"],
    },
    teamRegistration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamRegistration",
      required: [true, "Please specify the team"],
    },
    position: {
      type: Number,
      required: [true, "Please provide the position"],
      min: [1, "Position cannot be less than 1"],
    },
    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
    },
    remarks: {
      type: String,
    },
    announcedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify who announced the result"],
    },
    announcedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompetitionResult>(
  "CompetitionResult",
  CompetitionResultSchema
);
