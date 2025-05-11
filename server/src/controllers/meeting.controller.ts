import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Meeting from "../models/meeting.model";
import User from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/CustomError";
import {
  sendEmail,
  generateMeetingInvitationEmail,
} from "../utils/emailSender";
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

// @desc    Create a new meeting
// @route   POST /api/meetings
// @access  Private (President, VP, AVP, Head, Deputy)
export const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { title, description, dateTime, location, attendeeRoles, agenda } =
      req.body;

    // Only President, VP, AVP, Head, and Deputy can create meetings
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      currentUser.role !== "AVP" &&
      currentUser.role !== "Head" &&
      currentUser.role !== "Deputy"
    ) {
      throw new ForbiddenError("Not authorized to create meetings");
    }

    if (!title || !description || !dateTime || !location || !attendeeRoles) {
      throw new BadRequestError("Please provide all required fields");
    }

    // Validate attendeeRoles format
    if (!Array.isArray(attendeeRoles) || attendeeRoles.length === 0) {
      throw new BadRequestError("Please provide valid attendee roles");
    }

    // Get attendees based on roles and hierarchy
    const attendees = await getAttendees(currentUser, attendeeRoles);

    if (attendees.length === 0) {
      throw new BadRequestError(
        "No valid attendees found for the specified roles"
      );
    }

    // Create the meeting
    const meeting = await Meeting.create({
      title,
      description,
      dateTime: new Date(dateTime),
      location,
      organizer: currentUser._id,
      attendees,
      invitationSent: false,
      status: "scheduled",
      minutes: agenda || "",
    });

    // Send meeting invitations
    const attendeeUsers = await User.find({
      _id: { $in: attendees },
    });

    for (const user of attendeeUsers) {
      await sendEmail({
        to: user.email,
        subject: `Meeting Invitation: ${title}`,
        html: generateMeetingInvitationEmail(
          title,
          new Date(dateTime),
          location,
          currentUser.name,
          agenda
        ),
      });
    }

    // Update meeting to mark invitations as sent
    await Meeting.findByIdAndUpdate(meeting._id, {
      invitationSent: true,
    });

    // Populate the meeting with organizer and attendee details
    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("organizer", "name email role")
      .populate("attendees", "name email role");

    res.status(201).json({
      success: true,
      data: populatedMeeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
export const getMeetings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    let query = {};

    // Define role hierarchy
    const roleHierarchy = {
      President: 5,
      VP: 4,
      AVP: 3,
      Head: 2,
      Deputy: 1,
      Officer: 0,
    };

    const currentUserLevel = roleHierarchy[currentUser.role];

    // President can see all meetings
    if (currentUser.role !== "President") {
      query = {
        $or: [
          // User is the organizer
          { organizer: currentUser._id },
          // User is an attendee
          { attendees: currentUser._id },
          // Meeting is organized by someone at the same or lower level
          {
            "organizer.role": {
              $in: Object.entries(roleHierarchy)
                .filter(([_, level]) => level <= currentUserLevel)
                .map(([role]) => role),
            },
          },
        ],
      };
    }

    // Apply additional filters
    if (req.query.status) {
      query = { ...query, status: req.query.status };
    }

    const meetings = await Meeting.find(query)
      .populate("organizer", "name email role")
      .populate("attendees", "name email role")
      .sort({ dateTime: 1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single meeting
// @route   GET /api/meetings/:id
// @access  Private
export const getMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const meeting = await Meeting.findById(id)
      .populate("organizer", "name email role")
      .populate("attendees", "name email role");

    if (!meeting) {
      throw new NotFoundError("Meeting not found");
    }

    // Check if user has access to the meeting
    if (
      currentUser.role !== "President" &&
      getUserId(meeting.organizer) !== currentUser._id.toString() &&
      !meeting.attendees.some(
        (attendee) => getUserId(attendee) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError("Not authorized to access this meeting");
    }

    res.status(200).json({
      success: true,
      data: meeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private (meeting organizer only)
export const updateMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { title, description, dateTime, location, status, minutes } =
      req.body;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      throw new NotFoundError("Meeting not found");
    }

    // Only the organizer or President can update the meeting
    if (
      currentUser.role !== "President" &&
      getUserId(meeting.organizer) !== currentUser._id.toString()
    ) {
      throw new ForbiddenError(
        "You can only update meetings that you have created"
      );
    }

    // Update the meeting
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      {
        title,
        description,
        dateTime: dateTime ? new Date(dateTime) : meeting.dateTime,
        location,
        status,
        minutes,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("organizer", "name email role")
      .populate("attendees", "name email role");

    // If date or time changed, notify attendees
    if (
      dateTime &&
      new Date(dateTime).getTime() !== meeting.dateTime.getTime()
    ) {
      const attendeeUsers = await User.find({
        _id: { $in: meeting.attendees },
      });

      for (const user of attendeeUsers) {
        await sendEmail({
          to: user.email,
          subject: `Meeting Update: ${title || meeting.title}`,
          html: `
            <h1>Meeting Update</h1>
            <p>The following meeting has been updated:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <h2>${title || meeting.title}</h2>
              <p><strong>New Date & Time:</strong> ${new Date(dateTime).toLocaleString()}</p>
              <p><strong>Location:</strong> ${location || meeting.location}</p>
              <p><strong>Organized By:</strong> ${currentUser.name}</p>
            </div>
            <p>Please log in to the SOFTEC Management System for more details.</p>
          `,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: updatedMeeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel meeting
// @route   PUT /api/meetings/:id/cancel
// @access  Private (meeting organizer only)
export const cancelMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { reason } = req.body;

    const meeting = await Meeting.findById(id)
      .populate("organizer", "name email role")
      .populate("attendees", "name email role");

    if (!meeting) {
      throw new NotFoundError("Meeting not found");
    }

    // Only the organizer or President can cancel the meeting
    if (
      currentUser.role !== "President" &&
      getUserId(meeting.organizer) !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to cancel this meeting");
    }

    // Check if meeting is already cancelled
    if (meeting.status === "cancelled") {
      throw new BadRequestError("Meeting is already cancelled");
    }

    // Update the meeting status
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        minutes: reason
          ? `Meeting cancelled. Reason: ${reason}`
          : "Meeting cancelled",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("organizer", "name email role")
      .populate("attendees", "name email role");

    // Notify attendees
    for (const attendee of meeting.attendees) {
      if (typeof attendee !== "string" && attendee.email) {
        await sendEmail({
          to: attendee.email,
          subject: `Meeting Cancelled: ${meeting.title}`,
          html: `
            <h1>Meeting Cancelled</h1>
            <p>The following meeting has been cancelled:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <h2>${meeting.title}</h2>
              <p><strong>Originally scheduled for:</strong> ${meeting.dateTime.toLocaleString()}</p>
              <p><strong>Location:</strong> ${meeting.location}</p>
              <p><strong>Organized By:</strong> ${
                typeof meeting.organizer !== "string"
                  ? meeting.organizer.name
                  : "Unknown"
              }</p>
              ${
                reason
                  ? `<p><strong>Reason for cancellation:</strong> ${reason}</p>`
                  : ""
              }
            </div>
          `,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: updatedMeeting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private (President only)
export const deleteMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Only the President can delete meetings
    if (currentUser.role !== "President") {
      throw new ForbiddenError("Not authorized to delete meetings");
    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      throw new NotFoundError("Meeting not found");
    }

    await Meeting.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get attendees based on roles and hierarchy
async function getAttendees(
  organizer: IUser,
  attendeeRoles: string[]
): Promise<string[]> {
  const attendees: string[] = [];

  // Validate attendee roles based on organizer's role
  const validRoles = getValidAttendeeRoles(organizer.role);
  const invalidRoles = attendeeRoles.filter(
    (role) => !validRoles.includes(role)
  );

  if (invalidRoles.length > 0) {
    throw new BadRequestError(
      `Invalid attendee roles for ${organizer.role}: ${invalidRoles.join(", ")}. Valid roles are: ${validRoles.join(", ")}`
    );
  }

  let users;

  // For AVP and below, get users from the same competition
  if (["AVP", "Head", "Deputy"].includes(organizer.role)) {
    const organizerCompetitions = organizer.competitions || [];

    if (organizerCompetitions.length === 0) {
      throw new BadRequestError("Organizer is not part of any competition");
    }

    users = await User.find({
      role: { $in: attendeeRoles },
      _id: { $ne: organizer._id },
      competitions: { $in: organizerCompetitions },
    });
  } else {
    // For President and VP, get users with specified roles
    // Don't restrict to subordinates since they might not be set up yet
    users = await User.find({
      role: { $in: attendeeRoles },
      _id: { $ne: organizer._id },
    });
  }

  // Add users to attendees array
  attendees.push(...users.map((user) => user._id.toString()));

  if (attendees.length === 0) {
    throw new BadRequestError(
      `No users found with the roles: ${attendeeRoles.join(", ")}. Please make sure users with these roles exist in the system.`
    );
  }

  return attendees;
}

// Helper function to get valid attendee roles based on organizer's role
function getValidAttendeeRoles(organizerRole: string): string[] {
  switch (organizerRole) {
    case "President":
      return ["VP", "AVP", "Head", "Deputy", "Officer"];
    case "VP":
      return ["AVP", "Head", "Deputy", "Officer"];
    case "AVP":
      return ["AVP", "Head", "Deputy", "Officer"];
    case "Head":
      return ["Head", "Deputy", "Officer"];
    case "Deputy":
      return ["Deputy", "Officer"];
    default:
      return [];
  }
}
