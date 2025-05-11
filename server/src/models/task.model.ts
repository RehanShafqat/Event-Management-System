import mongoose, { Schema } from "mongoose";
import { ITask } from "../types/task.types";

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a task title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a task description"],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify who assigned the task"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify who the task is assigned to"],
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date for the task"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["assigned", "in-progress", "completed", "overdue"],
      default: "assigned",
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Check if task is overdue
TaskSchema.pre<ITask>("save", function (next) {
  if (this.dueDate < new Date() && this.status !== "completed") {
    this.status = "overdue";
  }
  next();
});

export default mongoose.model<ITask>("Task", TaskSchema);
