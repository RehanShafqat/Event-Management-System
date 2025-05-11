import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Task from "../models/task.model";
import User from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/CustomError";
import { sendEmail, generateTaskAssignmentEmail } from "../utils/emailSender";
import { IUser } from "../types/user.types";
import logger from "../utils/logger";

// Helper function to get user ID from string or IUser object
function getUserId(obj: string | IUser): string {
  if (typeof obj === "string") {
    return obj;
  }
  if (obj && typeof obj === "object" && "_id" in obj) {
    return obj._id.toString();
  }
  throw new Error("Invalid user object");
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { title, description, assignedToId, dueDate, priority } = req.body;

    if (!title || !description || !assignedToId || !dueDate) {
      throw new BadRequestError("Please provide all required fields");
    }

    // Check if assignedTo user exists
    const assignedTo = await User.findById(assignedToId);

    if (!assignedTo) {
      throw new NotFoundError("Assigned user not found");
    }

    // Check if the current user can assign tasks to the assigned user based on hierarchy
    const canAssignTask = await checkHierarchyForTaskAssignment(
      currentUser,
      assignedTo
    );

    if (!canAssignTask) {
      throw new ForbiddenError(
        `A ${currentUser.role} cannot assign tasks to a ${assignedTo.role}`
      );
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      assignedBy: currentUser._id,
      assignedTo: assignedToId,
      dueDate: new Date(dueDate),
      priority: priority || "medium",
      status: "assigned",
    });

    // Send email notification
    await sendEmail({
      to: assignedTo.email,
      subject: "New Task Assignment - SOFTEC",
      html: generateTaskAssignmentEmail(
        title,
        description,
        new Date(dueDate),
        currentUser.name
      ),
    });

    // Populate the task with user details
    const populatedTask = await Task.findById(task._id)
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(201).json({
      success: true,
      data: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    let query = {};

    // Filter based on the user's role and query parameters
    if (currentUser.role === "President") {
      // President can see all tasks, but can filter by assignedBy or assignedTo
      if (req.query.assignedBy) {
        query = { ...query, assignedBy: req.query.assignedBy };
      }
      if (req.query.assignedTo) {
        query = { ...query, assignedTo: req.query.assignedTo };
      }
    } else {
      // Others can only see tasks they assigned or tasks assigned to them
      query = {
        $or: [{ assignedBy: currentUser._id }, { assignedTo: currentUser._id }],
      };

      // Additional filters for tasks they assigned
      if (req.query.assignedTo) {
        const isSubordinate = currentUser.subordinates.includes(
          req.query.assignedTo as string
        );

        if (!isSubordinate) {
          throw new ForbiddenError(
            "Not authorized to view tasks for this user"
          );
        }

        query = {
          assignedBy: currentUser._id,
          assignedTo: req.query.assignedTo,
        };
      }
    }

    // Filter by status
    if (req.query.status) {
      query = { ...query, status: req.query.status };
    }

    // Filter by priority
    if (req.query.priority) {
      query = { ...query, priority: req.query.priority };
    }

    const tasks = await Task.find(query)
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Check if user has access to the task
    if (
      currentUser.role !== "President" &&
      getUserId(task.assignedBy) !== currentUser._id.toString() &&
      getUserId(task.assignedTo) !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to access this task");
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private (task creator only)
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { title, description, dueDate, priority } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Only the task creator or President can update the task
    if (
      currentUser.role !== "President" &&
      task.assignedBy.toString() !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to update this task");
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        priority,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    // Notify the assigned user about the updates
    const assignedTo = await User.findById(task.assignedTo);

    if (assignedTo) {
      await sendEmail({
        to: assignedTo.email,
        subject: "Task Update - SOFTEC",
        html: `
          <h1>Task Update</h1>
          <p>A task assigned to you has been updated:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h2>${title || task.title}</h2>
            <p><strong>Description:</strong> ${description || task.description}</p>
            <p><strong>Due Date:</strong> ${
              dueDate
                ? new Date(dueDate).toDateString()
                : task.dueDate.toDateString()
            }</p>
            <p><strong>Priority:</strong> ${priority || task.priority}</p>
            <p><strong>Updated By:</strong> ${currentUser.name}</p>
          </div>
          <p>Please log in to the SOFTEC Management System to view more details.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (assigned user only)
export const updateTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["assigned", "in-progress", "completed"].includes(status)) {
      throw new BadRequestError("Please provide a valid status");
    }

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Only the assigned user can update the status
    if (
      currentUser.role !== "President" &&
      task.assignedTo.toString() !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to update this task status");
    }

    // Update task status and completedAt if completed
    const updateData: any = { status };

    if (status === "completed") {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    // Notify the task creator about the status update
    const assignedBy = await User.findById(task.assignedBy);

    if (assignedBy) {
      await sendEmail({
        to: assignedBy.email,
        subject: `Task ${status.charAt(0).toUpperCase() + status.slice(1)} - SOFTEC`,
        html: `
          <h1>Task Status Update</h1>
          <p>A task you assigned has been updated:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h2>${task.title}</h2>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Updated By:</strong> ${currentUser.name}</p>
            ${
              status === "completed"
                ? `<p><strong>Completed At:</strong> ${new Date().toLocaleString()}</p>`
                : ""
            }
          </div>
          <p>Please log in to the SOFTEC Management System to view more details.</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (task creator or President only)
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    // Only the task creator or President can delete the task
    if (
      currentUser.role !== "President" &&
      task.assignedBy.toString() !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to delete this task");
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check hierarchy for task assignment
async function checkHierarchyForTaskAssignment(
  assigningUser: IUser,
  assignedUser: IUser
): Promise<boolean> {
  // President can assign tasks to anyone
  if (assigningUser.role === "President") {
    return true;
  }

  // Check if the assigned user is a direct subordinate
  const isSubordinate = assigningUser.subordinates.includes(
    assignedUser._id.toString()
  );

  if (!isSubordinate) {
    return false;
  }

  // Check role hierarchy
  const hierarchyMap: { [key: string]: string[] } = {
    VP: ["AVP"],
    AVP: ["Head"],
    Head: ["Deputy"],
    Deputy: ["Officer"],
  };

  return hierarchyMap[assigningUser.role]?.includes(assignedUser.role) || false;
}
