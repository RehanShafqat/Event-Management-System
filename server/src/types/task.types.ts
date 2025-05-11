import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface ITask extends Document {
  title: string;
  description: string;
  assignedBy: string | IUser;
  assignedTo: string | IUser;
  dueDate: Date;
  priority: "low" | "medium" | "high" | "urgent";
  status: "assigned" | "in-progress" | "completed" | "overdue";
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
