import { Request, Response, NextFunction } from "express";
import { RecruitmentApplication } from "../models/recruitmentApplication.model";
import User from "../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/CustomError";
import { sendEmail } from "../utils/emailSender";
import { IUser } from "../types/user.types";
import logger from "../utils/logger";
import bcrypt from "bcryptjs";

// @desc    Submit recruitment application
// @route   POST /api/recruitment/apply
// @access  Public
export const applyForRecruitment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      email,
      appliedRole,
      experience,
      skills,
      resumeUrl,
      competition,
    } = req.body;

    // Validate role
    if (!["AVP", "Head", "Deputy", "Officer"].includes(appliedRole)) {
      throw new BadRequestError("Invalid role specified");
    }

    // Create application
    const application = await RecruitmentApplication.create({
      name,
      email,
      appliedRole,
      experience,
      skills,
      resumeUrl,
      competition,
      status: "pending",
    });

    // Send confirmation email
    await sendEmail({
      to: email,
      subject: "Recruitment Application Received - SOFTEC",
      html: `
        <h1>Application Received</h1>
        <p>Dear ${name},</p>
        <p>Thank you for applying for the role of ${appliedRole} at SOFTEC.</p>
        <p>Your application has been received and is under review. We will get back to you shortly.</p>
        <p>Regards,</p>
        <p>SOFTEC Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recruitment applications
// @route   GET /api/recruitment/applications
// @access  Private (President, VP, AVP)
export const getApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;

    // Only President, VP, and AVP can view applications
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      currentUser.role !== "AVP"
    ) {
      throw new ForbiddenError(
        "Not authorized to view recruitment applications"
      );
    }

    let query = {};

    // Filter by role
    if (req.query.role) {
      query = { ...query, appliedRole: req.query.role };
    }

    // Filter by status
    if (req.query.status) {
      query = { ...query, status: req.query.status };
    }

    // Filter by role hierarchy for AVPs and VPs
    if (currentUser.role === "AVP") {
      // AVPs can only view applications for roles they can supervise
      query = { ...query, appliedRole: { $in: ["Head"] } };
    } else if (currentUser.role === "VP") {
      // VPs can only view applications for roles they can supervise
      query = { ...query, appliedRole: { $in: ["AVP"] } };
    }

    const applications = await RecruitmentApplication.find(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single recruitment application
// @route   GET /api/recruitment/applications/:id
// @access  Private (President, VP, AVP)
export const getApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Only President, VP, and AVP can view applications
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      currentUser.role !== "AVP"
    ) {
      throw new ForbiddenError(
        "Not authorized to view recruitment applications"
      );
    }

    const application = await RecruitmentApplication.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Check if user has access to this application based on role hierarchy
    if (currentUser.role === "AVP" && application.appliedRole !== "Head") {
      throw new ForbiddenError(
        "Not authorized to view this recruitment application"
      );
    } else if (currentUser.role === "VP" && application.appliedRole !== "AVP") {
      throw new ForbiddenError(
        "Not authorized to view this recruitment application"
      );
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update recruitment application status
// @route   PUT /api/recruitment/applications/:id/status
// @access  Private (President, VP, AVP)
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;
    const { status, notes } = req.body;

    // Only President, VP, and AVP can update applications
    if (
      currentUser.role !== "President" &&
      currentUser.role !== "VP" &&
      currentUser.role !== "AVP"
    ) {
      throw new ForbiddenError(
        "Not authorized to update recruitment applications"
      );
    }

    // Validate status
    if (
      ![
        "pending",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
      ].includes(status)
    ) {
      throw new BadRequestError("Invalid status specified");
    }

    const application = await RecruitmentApplication.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Check if user has access to this application based on role hierarchy
    if (currentUser.role === "AVP" && application.appliedRole !== "Head") {
      throw new ForbiddenError(
        "Not authorized to update this recruitment application"
      );
    } else if (currentUser.role === "VP" && application.appliedRole !== "AVP") {
      throw new ForbiddenError(
        "Not authorized to update this recruitment application"
      );
    }

    // Update application
    const updatedApplication = await RecruitmentApplication.findByIdAndUpdate(
      id,
      {
        status,
        notes: notes || application.notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // If application is selected, create a new user account
    if (status === "selected") {
      try {
        // Generate a temporary password (name + random number)
        const tempPassword = `${application.name}${Math.floor(Math.random() * 1000)}`;

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);

        // Create new user
        const newUser = await User.create({
          name: application.name,
          email: application.email,
          password: hashedPassword,
          role: application.appliedRole,
          isActive: true,
          department: "SOFTEC",
        });

        // Send selection email with credentials
        await sendEmail({
          to: application.email,
          subject: "Congratulations! You've Been Selected - SOFTEC",
          html: `
            <h1>Congratulations on Your Selection!</h1>
            <p>Dear ${application.name},</p>
            <p>We are pleased to inform you that your application for the role of ${application.appliedRole} at SOFTEC has been selected!</p>
            <p>Your account has been created with the following credentials:</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p>Please login to your account and change your password immediately.</p>
            <p>Welcome to the SOFTEC team!</p>
            <p>Regards,</p>
            <p>SOFTEC Team</p>
          `,
        });

        logger.info(
          `Created new user account for selected applicant: ${application.email}`
        );
      } catch (error) {
        logger.error(
          `Error creating user account for selected applicant: ${error}`
        );
        // Don't throw error here to avoid affecting the application status update
      }
    } else {
      // Send status update email for other statuses
      await sendEmail({
        to: application.email,
        subject: "Application Status Update - SOFTEC",
        html: `
          <h1>Application Status Update</h1>
          <p>Dear ${application.name},</p>
          <p>Your application for the role of ${application.appliedRole} at SOFTEC has been updated.</p>
          <p>Your application status is now: <strong>${status}</strong></p>
          ${notes ? `<p>Additional notes: ${notes}</p>` : ""}
          <p>Regards,</p>
          <p>SOFTEC Team</p>
        `,
      });
    }

    res.status(200).json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete recruitment application
// @route   DELETE /api/recruitment/applications/:id
// @access  Private (President, VP)
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const currentUser = req.user as IUser;
    const { id } = req.params;

    // Only President and VP can delete applications
    if (currentUser.role !== "President" && currentUser.role !== "VP") {
      throw new ForbiddenError(
        "Not authorized to delete recruitment applications"
      );
    }

    const application = await RecruitmentApplication.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Check if VP has access to this application based on role
    if (currentUser.role === "VP" && application.appliedRole !== "AVP") {
      throw new ForbiddenError(
        "Not authorized to delete this recruitment application"
      );
    }

    await RecruitmentApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
