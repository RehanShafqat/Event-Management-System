import mongoose, { Schema } from "mongoose";
import { IMeeting } from "../types/meeting.types";

const MeetingSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a meeting title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a meeting description"],
    },
    dateTime: {
      type: Date,
      required: [true, "Please provide a date and time for the meeting"],
    },
    location: {
      type: String,
      required: [true, "Please provide a meeting location"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please specify the meeting organizer"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    invitationSent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    minutes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMeeting>("Meeting", MeetingSchema);
