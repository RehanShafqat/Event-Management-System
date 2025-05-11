import { Request, Response, NextFunction } from "express";
import { RecruitmentApplication } from "../models/recruitmentApplication.model";
import User from "../models/user.model";
import Competition from "../models/competition.model";
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

    const applications = await RecruitmentApplication.find(query)
      .populate("competition", "name")
      .sort({ createdAt: -1 });

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

    // If application is selected, create a new user account and add to competition staff
    if (status === "selected") {
      try {
        // Generate a temporary password (name + random number)
        const tempPassword = `${application.name.replace(/\s+/g, "")}${Math.floor(Math.random() * 1000)}`;

        // Create new user with plain password (it will be hashed by the User model's pre-save hook)
        const newUser = await User.create({
          name: application.name,
          email: application.email,
          password: tempPassword, // The User model will hash this password
          role: application.appliedRole,
          isActive: true,
          department: "SOFTEC",
        });

        // Add user to competition staff based on their role
        const competition = await Competition.findById(application.competition);
        if (competition) {
          const userId = newUser._id.toString();
          const competitionId = competition._id.toString();

          // Add user to competition staff based on role
          switch (application.appliedRole) {
            case "AVP":
              competition.avp = userId;
              break;
            case "Head":
              competition.heads = [...(competition.heads as string[]), userId];
              break;
            case "Deputy":
              competition.deputies = [
                ...(competition.deputies as string[]),
                userId,
              ];
              break;
            case "Officer":
              competition.officers = [
                ...(competition.officers as string[]),
                userId,
              ];
              break;
          }
          await competition.save();

          // Add competition to user's competitions array
          newUser.competitions = [
            ...(newUser.competitions || []),
            competitionId,
          ];
          await newUser.save();

          // Add the new user to subordinates list of all users one level above their role
          const roleHierarchy = {
            AVP: "VP", // VP is one level above AVP
            Head: "AVP", // AVP is one level above Head
            Deputy: "Head", // Head is one level above Deputy
            Officer: "Deputy", // Deputy is one level above Officer
          };

          const superiorRole = roleHierarchy[application.appliedRole];
          logger.info(
            `Selected role: ${application.appliedRole}, Superior role: ${superiorRole}`
          );

          if (superiorRole) {
            // For VP role, find all VPs in the organization
            if (superiorRole === "VP") {
              const vps = await User.find({ role: "VP" });
              logger.info(`Found ${vps.length} VPs in the organization`);

              // Add the new user to each VP's subordinates list
              for (const vp of vps) {
                logger.info(`Processing VP: ${vp.name}`);
                logger.info(`Current subordinates: ${vp.subordinates}`);

                // Initialize subordinates array if it doesn't exist
                if (!vp.subordinates) {
                  vp.subordinates = [];
                }

                if (!vp.subordinates.includes(userId)) {
                  vp.subordinates.push(userId);
                  await vp.save();
                  logger.info(
                    `Added ${newUser.name} to VP ${vp.name}'s subordinates list`
                  );
                } else {
                  logger.info(
                    `${newUser.name} is already in VP ${vp.name}'s subordinates list`
                  );
                }
              }
            } else {
              // For other roles, find users with the superior role in this competition
              const superiorUsers = await User.find({
                role: superiorRole,
                competitions: competitionId,
              });

              logger.info(
                `Found ${superiorUsers.length} superior users with role ${superiorRole}`
              );

              // Add the new user to each superior's subordinates list
              for (const superior of superiorUsers) {
                logger.info(
                  `Processing superior user: ${superior.name} (${superior.role})`
                );
                logger.info(`Current subordinates: ${superior.subordinates}`);

                // Initialize subordinates array if it doesn't exist
                if (!superior.subordinates) {
                  superior.subordinates = [];
                }

                if (!superior.subordinates.includes(userId)) {
                  superior.subordinates.push(userId);
                  await superior.save();
                  logger.info(
                    `Added ${newUser.name} to ${superior.name}'s subordinates list`
                  );
                } else {
                  logger.info(
                    `${newUser.name} is already in ${superior.name}'s subordinates list`
                  );
                }
              }
            }
          } else {
            logger.warn(
              `No superior role found for ${application.appliedRole}`
            );
          }
        }

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
            <p>You have been added to the staff of the competition: ${competition?.name || "N/A"}</p>
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
