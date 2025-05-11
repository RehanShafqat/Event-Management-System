import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Competition from "../models/competition.model";
import TeamRegistration from "../models/teamRegistration.model";
import CompetitionResult from "../models/competitionResults.model";
import User from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/CustomError";
import {
  sendEmail,
  generateCompetitionRegistrationEmail,
  generatePaymentConfirmationEmail,
} from "../utils/emailSender";
import { IUser, Role } from "../types/user.types";
import { ICompetition, ITeamRegistration } from "../types/competitionTypes";
import logger from "../utils/logger";

function isICompetition(obj: any): obj is ICompetition {
  return obj && typeof obj === "object" && "registrationFee" in obj;
}

function isIUser(obj: any): obj is IUser {
  return obj && typeof obj === "object" && "_id" in obj;
}

function getUserId(obj: string | IUser): string {
  if (typeof obj === "string") {
    return obj;
  }
  if (isIUser(obj)) {
    return obj._id.toString();
  }
  throw new Error("Invalid user object");
}

// @desc    Create a new competition
// @route   POST /api/competitions
// @access  Private (President, VP, AVP)
export const createCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      imageUrl,
      registrationFee,
      winnerPrize,
      runnerUpPrize,
      registrationDeadline,
      eventDate,
      venue,
      maxParticipantsPerTeam,
      avpId,
    } = req.body;

    const currentUser = req.user as IUser;

    // Only President and VP can create competitions
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      currentUser.role !== "AVP"
    ) {
      throw new ForbiddenError("Not authorized to create competitions");
    }

    let avp;

    if (currentUser.role === "President" || currentUser.role === "VP") {
      // President and VP must specify an AVP
      if (!avpId) {
        throw new BadRequestError("Please specify an AVP for this competition");
      }

      // Check if AVP exists and is subordinate of the current user
      avp = await User.findById(avpId);

      if (!avp) {
        throw new NotFoundError("AVP not found");
      }

      if (avp.role !== "AVP") {
        throw new BadRequestError("Specified user is not an AVP");
      }

      if (currentUser.role !== "President") {
        const isSubordinate = currentUser.subordinates.includes(avpId);

        if (!isSubordinate) {
          throw new ForbiddenError("Specified AVP is not your subordinate");
        }
      }
    } else {
      // If current user is AVP, they are automatically the AVP for the competition
      avp = currentUser;
    }

    // Create the competition
    const competition = await Competition.create({
      name,
      description,
      imageUrl,
      registrationFee,
      winnerPrize,
      runnerUpPrize,
      registrationDeadline: new Date(registrationDeadline),
      eventDate: new Date(eventDate),
      venue,
      maxParticipantsPerTeam,
      avp: avp._id,
    });

    // Update the AVP's competitions list
    await User.findByIdAndUpdate(avp._id, {
      $push: { competitions: competition._id },
    });

    res.status(201).json({
      success: true,
      data: competition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Private
export const getCompetitions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    let query = {};

    // Filter competitions based on user role
    if (currentUser.role !== "President" && currentUser.role !== "VP") {
      // AVPs, Heads, Deputies, and Officers can only see competitions they are part of
      query = {
        $or: [
          { avp: currentUser._id },
          { heads: currentUser._id },
          { deputies: currentUser._id },
          { officers: currentUser._id },
        ],
      };
    }

    // Apply additional filters (if provided)
    if (req.query.status) {
      query = { ...query, status: req.query.status };
    }

    const competitions = await Competition.find(query)
      .populate("avp", "name email imageUrl department")
      .populate("heads", "name email imageUrl department")
      .populate("deputies", "name email imageUrl department")
      .populate("officers", "name email imageUrl department");

    res.status(200).json({
      success: true,
      count: competitions.length,
      data: competitions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single competition
// @route   GET /api/competitions/:id
// @access  Private
export const getCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const competition = await Competition.findById(id)
      .populate("avp", "name email imageUrl department")
      .populate("heads", "name email imageUrl department")
      .populate("deputies", "name email imageUrl department")
      .populate("officers", "name email imageUrl department");

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has access to the competition
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      getUserId(competition.avp) !== currentUser._id.toString() &&
      !competition.heads.some(
        (head) => getUserId(head) === currentUser._id.toString()
      ) &&
      !competition.deputies.some(
        (deputy) => getUserId(deputy) === currentUser._id.toString()
      ) &&
      !competition.officers.some(
        (officer) => getUserId(officer) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError("Not authorized to access this competition");
    }

    res.status(200).json({
      success: true,
      data: competition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update competition
// @route   PUT /api/competitions/:id
// @access  Private (President, VP, AVP)
export const updateCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const {
      name,
      description,
      imageUrl,
      registrationFee,
      winnerPrize,
      runnerUpPrize,
      registrationDeadline,
      eventDate,
      venue,
      maxParticipantsPerTeam,
    } = req.body;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has permission to update
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      competition.avp.toString() !== currentUser._id.toString()
    ) {
      throw new ForbiddenError("Not authorized to update this competition");
    }

    // Update the competition
    const updatedCompetition = await Competition.findByIdAndUpdate(
      id,
      {
        name,
        description,
        imageUrl,
        registrationFee,
        winnerPrize,
        runnerUpPrize,
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline)
          : undefined,
        eventDate: eventDate ? new Date(eventDate) : undefined,
        venue,
        maxParticipantsPerTeam,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("avp", "name email imageUrl department")
      .populate("heads", "name email imageUrl department")
      .populate("deputies", "name email imageUrl department")
      .populate("officers", "name email imageUrl department");

    res.status(200).json({
      success: true,
      data: updatedCompetition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete competition
// @route   DELETE /api/competitions/:id
// @access  Private (President, VP)
export const deleteCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Only President and VP can delete competitions
    if (currentUser.role !== "President" && currentUser.role !== "VP") {
      throw new ForbiddenError("Not authorized to delete competitions");
    }

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if there are any registered teams
    const registrations = await TeamRegistration.countDocuments({
      competition: id,
    });

    if (registrations > 0) {
      throw new BadRequestError(
        "Cannot delete competition with existing registrations"
      );
    }

    // Remove competition from AVP's competitions list
    await User.findByIdAndUpdate(competition.avp, {
      $pull: { competitions: competition._id },
    });

    // Delete the competition
    await Competition.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign staff to competition
// @route   PUT /api/competitions/:id/assign-staff
// @access  Private (President, VP, AVP, Head)
export const assignStaffToCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { staffId, role } = req.body;

    if (!staffId || !role) {
      throw new BadRequestError("Please provide staffId and role");
    }

    if (!["Head", "Deputy", "Officer"].includes(role)) {
      throw new BadRequestError("Invalid role specified");
    }

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has permission to assign staff
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      competition.avp.toString() !== currentUser._id.toString() &&
      (role !== "Officer" ||
        !competition.heads.some(
          (head) => head.toString() === currentUser._id.toString()
        ))
    ) {
      throw new ForbiddenError(
        "Not authorized to assign staff to this competition"
      );
    }

    // Check if staff member exists and has the correct role
    const staff = await User.findById(staffId);

    if (!staff) {
      throw new NotFoundError("Staff member not found");
    }

    if (staff.role !== role) {
      throw new BadRequestError(
        `Staff member is not a ${role}, but a ${staff.role}`
      );
    }

    // Check if staff is a subordinate of the current user
    const isSubordinate = currentUser.subordinates.includes(staffId);

    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      !isSubordinate
    ) {
      throw new ForbiddenError(
        "Specified staff member is not your subordinate"
      );
    }

    // Add staff to the competition based on their role
    let update = {};
    if (role === "Head") {
      update = { $addToSet: { heads: staffId } };
    } else if (role === "Deputy") {
      update = { $addToSet: { deputies: staffId } };
    } else if (role === "Officer") {
      update = { $addToSet: { officers: staffId } };
    }

    const updatedCompetition = await Competition.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("avp", "name email imageUrl department")
      .populate("heads", "name email imageUrl department")
      .populate("deputies", "name email imageUrl department")
      .populate("officers", "name email imageUrl department");

    // Add competition to staff member's competitions list
    await User.findByIdAndUpdate(staffId, {
      $addToSet: { competitions: id },
    });

    res.status(200).json({
      success: true,
      data: updatedCompetition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove staff from competition
// @route   PUT /api/competitions/:id/remove-staff
// @access  Private (President, VP, AVP, Head)
export const removeStaffFromCompetition = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { staffId, role } = req.body;

    if (!staffId || !role) {
      throw new BadRequestError("Please provide staffId and role");
    }

    if (!["Head", "Deputy", "Officer"].includes(role)) {
      throw new BadRequestError("Invalid role specified");
    }

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has permission to remove staff
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      competition.avp.toString() !== currentUser._id.toString() &&
      (role !== "Officer" ||
        !competition.heads.some(
          (head) => head.toString() === currentUser._id.toString()
        ))
    ) {
      throw new ForbiddenError(
        "Not authorized to remove staff from this competition"
      );
    }

    // Remove staff from the competition based on their role
    let update = {};
    if (role === "Head") {
      update = { $pull: { heads: staffId } };
    } else if (role === "Deputy") {
      update = { $pull: { deputies: staffId } };
    } else if (role === "Officer") {
      update = { $pull: { officers: staffId } };
    }

    const updatedCompetition = await Competition.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .populate("avp", "name email imageUrl department")
      .populate("heads", "name email imageUrl department")
      .populate("deputies", "name email imageUrl department")
      .populate("officers", "name email imageUrl department");

    // Remove competition from staff member's competitions list
    await User.findByIdAndUpdate(staffId, {
      $pull: { competitions: id },
    });

    res.status(200).json({
      success: true,
      data: updatedCompetition,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a team for a competition
// @route   POST /api/competitions/:id/register
// @access  Public
export const registerTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { teamName, participants } = req.body;

    // Check if competition exists
    const competition = await Competition.findById(id);
    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(competition.registrationDeadline)) {
      throw new BadRequestError("Registration deadline has passed");
    }

    // Check if team name already exists in this competition
    const existingTeam = await TeamRegistration.findOne({
      competition: id,
      teamName: teamName.trim(),
    });

    if (existingTeam) {
      throw new BadRequestError(
        "A team with this name already exists in this competition"
      );
    }

    // Validate number of participants
    if (participants.length > competition.maxParticipantsPerTeam) {
      throw new BadRequestError(
        `Maximum of ${competition.maxParticipantsPerTeam} participants allowed per team`
      );
    }

    // Create team registration
    const teamRegistration = await TeamRegistration.create({
      teamName: teamName.trim(),
      competition: id,
      participants: participants.map((p) => ({
        name: p.name.trim(),
        email: p.email.trim(),
        phone: p.phone.trim(),
        institution: p.institution.trim(),
      })),
    });

    // Send registration confirmation email
    const emailContent = generateCompetitionRegistrationEmail(
      competition.name,
      teamRegistration.teamName,
      teamRegistration.participants.map((p) => p.name),
      new Date()
    );

    await sendEmail({
      to: participants[0].email,
      subject: `Registration Confirmation - ${competition.name}`,
      html: emailContent,
    });

    res.status(201).json({
      success: true,
      data: teamRegistration,
      message:
        "Team registered successfully. Please check your email for payment details.",
      bankDetails: {
        accountName: "SOFTEC",
        accountNumber: "1234567890",
        bankName: "HBL",
        reference: `SOFTEC-${competition.name}-${teamRegistration._id}`,
        amount: competition.registrationFee,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm team payment
// @route   PUT /api/competitions/registrations/:id/confirm-payment
// @access  Private (President, VP, AVP)
export const confirmTeamPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentProofUrl } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Check if user has permission (President, VP, or AVP)
    const user = await User.findById(userId);
    if (!user || !["President", "VP", "AVP"].includes(user.role)) {
      res
        .status(403)
        .json({ message: "You don't have permission to confirm payments" });
      return;
    }

    // Find the team registration
    const team = await TeamRegistration.findById(id).populate<{
      competition: ICompetition;
    }>("competition");
    if (!team) {
      res.status(404).json({ message: "Team registration not found" });
      return;
    }

    // Update the payment status and proof
    team.paymentStatus = "confirmed";
    team.paymentProofUrl = paymentProofUrl;
    team.confirmedBy = user._id.toString();
    team.confirmationDate = new Date();

    await team.save();

    // Send payment confirmation email to all participants
    const emailContent = generatePaymentConfirmationEmail(
      team.competition.name,
      team.teamName,
      team.competition.registrationFee,
      new Date()
    );

    // Send email to each participant
    const emailPromises = team.participants.map((participant) =>
      sendEmail({
        to: participant.email,
        subject: `Payment Confirmation - ${team.competition.name}`,
        html: emailContent,
      })
    );

    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      data: team,
      message:
        "Payment confirmed and notification emails sent to all participants",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all team registrations for a competition
// @route   GET /api/competitions/:id/registrations
// @access  Private
export const getCompetitionRegistrations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has access to the competition
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      getUserId(competition.avp) !== currentUser._id.toString() &&
      !competition.heads.some(
        (head) => getUserId(head) === currentUser._id.toString()
      ) &&
      !competition.deputies.some(
        (deputy) => getUserId(deputy) === currentUser._id.toString()
      ) &&
      !competition.officers.some(
        (officer) => getUserId(officer) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError("Not authorized to access this competition");
    }

    // Get registrations for the competition
    const registrations = await TeamRegistration.find({
      competition: id,
    }).populate("confirmedBy", "name email");

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add competition result
// @route   POST /api/competitions/:id/results
// @access  Private (President, VP, AVP, Head)
export const addCompetitionResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { teamRegistrationId, position, score, remarks } = req.body;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has permission to add results
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      getUserId(competition.avp) !== currentUser._id.toString() &&
      !competition.heads.some(
        (head) => getUserId(head) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError(
        "Not authorized to add results to this competition"
      );
    }

    // Check if team registration exists
    const registration = await TeamRegistration.findById(teamRegistrationId);

    if (!registration) {
      throw new NotFoundError("Team registration not found");
    }

    if (registration.competition.toString() !== id) {
      throw new BadRequestError(
        "Team registration does not belong to this competition"
      );
    }

    // Create the result
    const result = await CompetitionResult.create({
      competition: id,
      teamRegistration: teamRegistrationId,
      position,
      score,
      remarks,
      announcedBy: currentUser._id,
      announcedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all results for a competition
// @route   GET /api/competitions/:id/results
// @access  Private
export const getCompetitionResults = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Get results for the competition
    const results = await CompetitionResult.find({
      competition: id,
    })
      .populate("teamRegistration", "teamName participants")
      .populate("announcedBy", "name email");

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all participants for a competition
// @route   GET /api/competitions/:id/participants
// @access  Private
export const getCompetitionParticipants = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has access to the competition
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      getUserId(competition.avp) !== currentUser._id.toString() &&
      !competition.heads.some(
        (head) => getUserId(head) === currentUser._id.toString()
      ) &&
      !competition.deputies.some(
        (deputy) => getUserId(deputy) === currentUser._id.toString()
      ) &&
      !competition.officers.some(
        (officer) => getUserId(officer) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError("Not authorized to access this competition");
    }

    // Get all registrations for the competition
    const registrations = await TeamRegistration.find({
      competition: id,
    }).select("teamName participants");

    // Flatten participants array and add team name
    const participants = registrations.flatMap((registration) =>
      registration.participants.map((participant) => ({
        ...participant,
        teamName: registration.teamName,
      }))
    );

    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all teams for a competition
// @route   GET /api/competitions/:id/teams
// @access  Private
export const getCompetitionTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    const competition = await Competition.findById(id);

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    // Check if user has access to the competition
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      getUserId(competition.avp) !== currentUser._id.toString() &&
      !competition.heads.some(
        (head) => getUserId(head) === currentUser._id.toString()
      ) &&
      !competition.deputies.some(
        (deputy) => getUserId(deputy) === currentUser._id.toString()
      ) &&
      !competition.officers.some(
        (officer) => getUserId(officer) === currentUser._id.toString()
      )
    ) {
      throw new ForbiddenError("Not authorized to access this competition");
    }

    // Get all teams for the competition
    const teams = await TeamRegistration.find({
      competition: id,
    })
      .populate("confirmedBy", "name email")
      .select(
        "teamName participants paymentStatus registrationDate confirmedBy"
      );

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all competitions for public view
// @route   GET /api/competitions/public
// @access  Public
export const getPublicCompetitions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const competitions = await Competition.find()
      .select(
        "name description imageUrl registrationFee winnerPrize runnerUpPrize registrationDeadline eventDate venue maxParticipantsPerTeam status heads"
      )
      .populate("heads", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: competitions.length,
      data: competitions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single competition for public view
// @route   GET /api/competitions/public/:id
// @access  Public
export const getPublicCompetitionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const competition = await Competition.findById(id)
      .select(
        "name description imageUrl registrationFee winnerPrize runnerUpPrize registrationDeadline eventDate venue maxParticipantsPerTeam status heads"
      )
      .populate("heads", "name email");

    if (!competition) {
      throw new NotFoundError("Competition not found");
    }

    res.status(200).json({
      success: true,
      data: competition,
    });
  } catch (error) {
    next(error);
  }
};
