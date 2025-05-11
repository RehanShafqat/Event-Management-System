import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface IMeeting extends Document {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  organizer: string | IUser;
  attendees: string[] | IUser[];
  invitationSent: boolean;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  minutes?: string;
  createdAt: Date;
  updatedAt: Date;
}
