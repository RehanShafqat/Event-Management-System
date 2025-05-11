import mongoose, { Schema } from "mongoose";
import { ITeamRegistration } from "../types/competitionTypes";

const teamRegistrationSchema = new Schema<ITeamRegistration>(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    competition: {
      type: Schema.Types.ObjectId,
      ref: "Competition",
      required: [true, "Competition is required"],
    },
    participants: [
      {
        name: {
          type: String,
          required: [true, "Participant name is required"],
        },
        email: {
          type: String,
          required: [true, "Participant email is required"],
        },
        phone: {
          type: String,
          required: [true, "Participant phone is required"],
        },
        institution: {
          type: String,
          required: [true, "Participant institution is required"],
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    paymentProofUrl: {
      type: String,
    },
    confirmedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    confirmationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that the number of participants does not exceed maxParticipantsPerTeam
teamRegistrationSchema.pre<ITeamRegistration>("save", async function (next) {
  try {
    const Competition = mongoose.model("Competition");
    const competition = await Competition.findById(this.competition);

    if (!competition) {
      throw new Error("Competition not found");
    }

    if (this.participants.length > competition.maxParticipantsPerTeam) {
      throw new Error(
        `Maximum of ${competition.maxParticipantsPerTeam} participants allowed per team`
      );
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

const TeamRegistration = mongoose.model<ITeamRegistration>(
  "TeamRegistration",
  teamRegistrationSchema
);

export default TeamRegistration;
