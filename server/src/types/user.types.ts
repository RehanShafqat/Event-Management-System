import { Document } from "mongoose";

export type Role = "President" | "VP" | "AVP" | "Head" | "Deputy" | "Officer";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  department: string;
  imageUrl?: string;
  mfaSecret?: string;
  mfaEnabled: boolean;
  supervisor?: string;
  subordinates: string[];
  competitions?: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateMfaSecret(): string;
}
