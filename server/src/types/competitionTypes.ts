import { Document } from "mongoose";
import { IUser } from "./user.types";

export interface ICompetition extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  registrationFee: number;
  winnerPrize: number;
  runnerUpPrize: number;
  registrationDeadline: Date;
  eventDate: Date;
  venue: string;
  maxParticipantsPerTeam: number;
  status: "upcoming" | "ongoing" | "completed";
  avp: string | IUser;
  heads: string[] | IUser[];
  deputies: string[] | IUser[];
  officers: string[] | IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IParticipant extends Document {
  name: string;
  email: string;
  phone: string;
  institution: string;
}

export interface ITeamRegistration {
  _id: string;
  teamName: string;
  competition: string | ICompetition;
  participants: Array<{
    name: string;
    email: string;
    phone: string;
    institution: string;
  }>;
  paymentStatus: "pending" | "confirmed" | "rejected";
  registrationDate: Date;
  paymentProofUrl?: string;
  confirmedBy?: string | IUser;
  confirmationDate?: Date;
}

export interface ICompetitionResult extends Document {
  competition: string | ICompetition;
  teamRegistration: string | ITeamRegistration;
  position: number;
  score?: number;
  remarks?: string;
  announcedBy: string | IUser;
  announcedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
