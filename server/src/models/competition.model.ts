import mongoose, { Schema } from "mongoose";
import { ICompetition } from "../types/competitionTypes";

const CompetitionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a competition name"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    imageUrl: {
      type: String,
      default: "", // Default empty string for no image
    },
    registrationFee: {
      type: Number,
      required: [true, "Please provide a registration fee"],
      min: [0, "Registration fee cannot be negative"],
    },
    winnerPrize: {
      type: Number,
      required: [true, "Please provide a winner prize amount"],
      min: [0, "Winner prize cannot be negative"],
    },
    runnerUpPrize: {
      type: Number,
      required: [true, "Please provide a runner-up prize amount"],
      min: [0, "Runner-up prize cannot be negative"],
    },
    registrationDeadline: {
      type: Date,
      required: [true, "Please provide a registration deadline"],
    },
    eventDate: {
      type: Date,
      required: [true, "Please provide an event date"],
    },
    venue: {
      type: String,
      required: [true, "Please provide a venue"],
    },
    maxParticipantsPerTeam: {
      type: Number,
      required: [true, "Please provide maximum participants per team"],
      min: [1, "At least one participant is required per team"],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    avp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign an AVP to this competition"],
    },
    heads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deputies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    officers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompetition>("Competition", CompetitionSchema);
