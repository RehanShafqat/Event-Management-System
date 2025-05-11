import mongoose, { Schema } from "mongoose";
import { IRecruitmentApplication } from "../types/recruitmentApplication.types";

const recruitmentApplicationSchema = new Schema<IRecruitmentApplication>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
    },
    appliedRole: {
      type: String,
      enum: ["AVP", "Head", "Deputy", "Officer"],
      required: [true, "Please specify the role you are applying for"],
    },
    experience: {
      type: String,
      required: [true, "Please provide your experience"],
    },
    skills: {
      type: [String],
      required: [true, "Please provide your skills"],
    },
    resumeUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "interviewed", "selected", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RecruitmentApplication = mongoose.model<IRecruitmentApplication>(
  "RecruitmentApplication",
  recruitmentApplicationSchema
);
