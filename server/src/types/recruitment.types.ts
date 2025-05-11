import { Document } from "mongoose";
import { Role } from "./user.types";

export interface IRecruitmentApplication extends Document {
  name: string;
  email: string;
  phone: string;
  institution: string;
  appliedRole: Role;
  experience: string;
  skills: string[];
  resumeUrl?: string;
  status: "pending" | "shortlisted" | "interviewed" | "selected" | "rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
