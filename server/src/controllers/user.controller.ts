import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/CustomError";
import { sendEmail } from "../utils/emailSender";
import { IUser, Role } from "../types/user.types";

// @desc    Add a President (special route)
// @route   POST /api/users/president
// @access  Public (but should be secured by server configuration in production)
export const addPresident = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, department, imageUrl } = req.body;

    // Check if a president already exists
    const existingPresident = await User.findOne({ role: "President" });

    if (existingPresident) {
      throw new ForbiddenError("A president already exists in the system");
    }

    // Create the president
    const president = await User.create({
      name,
      email,
      password,
      role: "President",
      department,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: {
        id: president._id,
        name: president.name,
        email: president.email,
        role: president.role,
        department: president.department,
        imageUrl: president.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new user (based on hierarchy)
// @route   POST /api/users
// @access  Private
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, department, imageUrl } = req.body;
    const currentUser = req.user as IUser;

    // Check valid role hierarchy based on the current user's role
    const validHierarchy = await checkValidHierarchy(currentUser.role, role);

    if (!validHierarchy) {
      throw new ForbiddenError(
        `${currentUser.role} cannot add a user with role ${role}`
      );
    }

    // Create the new user
    const newUser = await User.create(
      [
        {
          name,
          email,
          password,
          role,
          department,
          imageUrl,
          supervisor: currentUser._id,
        },
      ],
      { session }
    );

    // Update the current user's subordinates list
    await User.findByIdAndUpdate(
      currentUser._id,
      {
        $push: { subordinates: newUser[0]._id },
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Notify the new user by email
    await sendEmail({
      to: email,
      subject: "Welcome to SOFTEC Management System",
      html: `
        <h1>Welcome to SOFTEC Management System</h1>
        <p>Dear ${name},</p>
        <p>You have been added to the SOFTEC Management System as a ${role} in the ${department} department.</p>
        <p>Your login credentials are:</p>
        <p>Email: ${email}</p>
        <p>Password: ${password}</p>
        <p>Please login to the system and change your password as soon as possible.</p>
        <p>Regards,</p>
        <p>SOFTEC Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUser[0]._id,
        name: newUser[0].name,
        email: newUser[0].email,
        role: newUser[0].role,
        department: newUser[0].department,
        imageUrl: newUser[0].imageUrl,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get all users (filtered by role or hierarchy if applicable)
// @route   GET /api/users
// @access  Private
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    let query = {};

    // Filter based on the user's role
    if (currentUser.role !== "President") {
      query = { _id: { $in: currentUser.subordinates } };
    }

    // Apply additional filters from query parameters
    if (req.query.role) {
      query = { ...query, role: req.query.role };
    }

    const users = await User.find(query).select("-password -mfaSecret");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Check if the user is trying to get themselves
    if (id === currentUser._id.toString()) {
      const user = await User.findById(id).select("-password -mfaSecret");

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.status(200).json({
        success: true,
        data: user,
      });
      return;
    }

    // If not the president, check if the requested user is a subordinate
    if (currentUser.role !== "President") {
      const isSubordinate = currentUser.subordinates.includes(id);

      if (!isSubordinate) {
        throw new ForbiddenError("Not authorized to access this user");
      }
    }

    const user = await User.findById(id).select("-password -mfaSecret");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { name, email, department, imageUrl } = req.body;

    // Don't allow password updates through this route
    if (req.body.password) {
      throw new BadRequestError(
        "This route is not for password updates. Use /api/users/update-password instead."
      );
    }

    // Don't allow role updates through this route
    if (req.body.role) {
      throw new BadRequestError(
        "This route is not for role updates. Use /api/users/update-role instead."
      );
    }

    // Check if the user is trying to update themselves
    if (id !== currentUser._id.toString()) {
      // If not the president, check if the requested user is a subordinate
      if (currentUser.role !== "President") {
        const isSubordinate = currentUser.subordinates.includes(id);

        if (!isSubordinate) {
          throw new ForbiddenError("Not authorized to update this user");
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        department,
        imageUrl,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -mfaSecret");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (President and VP only)
export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { role } = req.body;

    // Only President and VP can update roles
    if (currentUser.role !== "President" && currentUser.role !== "VP") {
      throw new ForbiddenError("Not authorized to update user roles");
    }

    // Check valid role hierarchy based on the current user's role
    const validHierarchy = await checkValidHierarchy(currentUser.role, role);

    if (!validHierarchy) {
      throw new ForbiddenError(
        `${currentUser.role} cannot update a user to role ${role}`
      );
    }

    // Check if the user is a subordinate
    if (currentUser.role !== "President") {
      const isSubordinate = currentUser.subordinates.includes(id);

      if (!isSubordinate) {
        throw new ForbiddenError("Not authorized to update this user");
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -mfaSecret");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Only supervisor of the user can delete)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check if current user is the supervisor
    if (
      user.supervisor?.toString() !== currentUser._id.toString() &&
      currentUser.role !== "President"
    ) {
      throw new ForbiddenError("Not authorized to delete this user");
    }

    // Check if user has subordinates
    if (user.subordinates.length > 0) {
      throw new BadRequestError(
        "Cannot delete user with subordinates. Reassign subordinates first."
      );
    }

    // Remove user from supervisor's subordinates list
    if (user.supervisor) {
      await User.findByIdAndUpdate(user.supervisor, {
        $pull: { subordinates: user._id },
      });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/update-password
// @access  Private (own account only)
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!._id).select("+password");

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check valid role hierarchy
async function checkValidHierarchy(
  currentRole: Role,
  targetRole: Role
): Promise<boolean> {
  const roleHierarchy: Record<Role, Role[]> = {
    President: ["VP"],
    VP: ["AVP"],
    AVP: ["Head"],
    Head: ["Deputy"],
    Deputy: ["Officer"],
    Officer: [],
  };

  return roleHierarchy[currentRole].includes(targetRole);
}

// Get users by role
export const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role } = req.params;

    // Validate role
    if (
      !["President", "AVP", "VP", "Head", "Deputy", "Officer"].includes(role)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
      return;
    }

    const users = await User.find({ role })
      .select("_id name email role")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
