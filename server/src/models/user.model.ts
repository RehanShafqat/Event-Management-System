import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { IUser, Role } from "../types/user.types";
import * as otplib from "otplib";

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["President", "VP", "AVP", "Head", "Deputy", "Officer"],
      required: [true, "Please provide a role"],
    },
    mfaSecret: {
      type: String,
      select: false,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subordinates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    competitions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Competition",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.generateAuthToken = function (): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const options: SignOptions = {
    expiresIn: "30d",
  };

  return jwt.sign({ id: this._id }, secret, options);
};

// Match user entered password to hashed password in database
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate MFA secret
UserSchema.methods.generateMfaSecret = function (): string {
  const secret = otplib.authenticator.generateSecret();
  this.mfaSecret = secret;
  return secret;
};

export default mongoose.model<IUser>("User", UserSchema);
