import nodemailer from "nodemailer";
import { CustomError } from "./CustomError";
import logger from "./logger";

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `SOFTEC Management <${process.env.EMAIL_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(",") : options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${options.to}`);
  } catch (error: unknown) {
    logger.error("Email sending failed:", error);
    throw new CustomError("Failed to send email", 500);
  }
};

export const generateTaskAssignmentEmail = (
  taskName: string,
  description: string,
  dueDate: Date,
  assignedBy: string
): string => {
  return `
    <h1>New Task Assignment</h1>
    <p>You have been assigned a new task:</p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
      <h2>${taskName}</h2>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Due Date:</strong> ${dueDate.toDateString()}</p>
      <p><strong>Assigned By:</strong> ${assignedBy}</p>
    </div>
    <p>Please log in to the SOFTEC Management System to view more details and track your progress.</p>
  `;
};

export const generateMeetingInvitationEmail = (
  title: string,
  dateTime: Date,
  location: string,
  organizer: string,
  agenda?: string
): string => {
  return `
    <h1>Meeting Invitation</h1>
    <p>You are invited to the following meeting:</p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
      <h2>${title}</h2>
      <p><strong>Date & Time:</strong> ${dateTime.toLocaleString()}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Organized By:</strong> ${organizer}</p>
      ${agenda ? `<p><strong>Agenda:</strong> ${agenda}</p>` : ""}
    </div>
    <p>Please log in to the SOFTEC Management System to confirm your attendance.</p>
  `;
};

export const generateCompetitionRegistrationEmail = (
  competitionName: string,
  teamName: string,
  participants: string[],
  registrationDate: Date
): string => {
  return `
    <h1>Competition Registration Confirmation</h1>
    <p>Your team has been successfully registered for the following competition:</p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
      <h2>${competitionName}</h2>
      <p><strong>Team Name:</strong> ${teamName}</p>
      <p><strong>Participants:</strong> ${participants.join(", ")}</p>
      <p><strong>Registration Date:</strong> ${registrationDate.toDateString()}</p>
    </div>
    <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin-top: 20px;">
      <h3>Payment Details</h3>
      <p><strong>Bank Name:</strong> ${process.env.BANK_NAME}</p>
      <p><strong>Account IBAN:</strong> ${process.env.ACCOUNT_IBAN}</p>
      <p><strong>Account Holder:</strong> ${process.env.ACCOUNT_HOLDER}</p>
      <p style="color: #d32f2f; font-weight: bold;">Please complete the payment to confirm your participation.</p>
    </div>
    
  `;
};

export const generatePaymentConfirmationEmail = (
  competitionName: string,
  teamName: string,
  amount: number,
  paymentDate: Date
): string => {
  return `
    <h1>Payment Confirmation</h1>
    <p>Your payment for the following competition has been confirmed:</p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
      <h2>${competitionName}</h2>
      <p><strong>Team Name:</strong> ${teamName}</p>
      <p><strong>Amount Paid:</strong> ${amount}</p>
      <p><strong>Payment Date:</strong> ${paymentDate.toDateString()}</p>
    </div>
    <p>Thank you for your payment. You are now officially registered for the competition.</p>
    <p>Please log in to the SOFTEC Management System for more details and updates.</p>
  `;
};
