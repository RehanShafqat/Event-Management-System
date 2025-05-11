import { Document, Types } from "mongoose";

export interface IRecruitmentApplication extends Document {
  name: string;
  email: string;
  appliedRole: "AVP" | "Head" | "Deputy" | "Officer";
  experience: string;
  skills: string[];
  resumeUrl?: string;
  status: "pending" | "shortlisted" | "interviewed" | "selected" | "rejected";
  notes?: string;
  competition: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
