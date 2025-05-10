import { Request, Response, NextFunction } from "express";
import { authenticator } from "otplib";
import qrcode from "qrcode";
import { BadRequestError, UnauthorizedError } from "../utils/CustomError";
import User from "../models/user.model";
import logger from "../utils/logger";

// Helper function to set token cookie
const setTokenCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password +mfaSecret");

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // If MFA is enabled, return the user's ID for verification
    if (user.mfaEnabled) {
      res.status(200).json({
        success: true,
        mfaRequired: true,
        userId: user._id,
      });
    } else {
      // Generate MFA secret if not already set
      if (!user.mfaSecret) {
        const secret = user.generateMfaSecret();
        await user.save();

        // Generate QR code
        const otpauth = authenticator.keyuri(
          user.email,
          "SOFTEC Management System",
          secret
        );
        const qrCode = await qrcode.toDataURL(otpauth);

        // Generate token and set cookie
        const token = user.generateAuthToken();
        setTokenCookie(res, token);

        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          setupMfa: true,
          qrCode,
        });
      } else {
        // Generate token and set cookie
        const token = user.generateAuthToken();
        setTokenCookie(res, token);

        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify MFA code
// @route   POST /api/auth/verify-mfa
// @access  Public
export const verifyMfa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, code } = req.body;

    // Validate userId and code
    if (!userId || !code) {
      throw new BadRequestError("Please provide userId and code");
    }

    // Find user by ID
    const user = await User.findById(userId).select("+mfaSecret");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user.mfaSecret) {
      throw new BadRequestError("MFA not set up for this user");
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedError("Invalid MFA code");
    }

    // If this is first verification, enable MFA
    if (!user.mfaEnabled) {
      user.mfaEnabled = true;
      await user.save();
    }

    // Generate token and set cookie
    const token = user.generateAuthToken();
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Setup MFA
// @route   POST /api/auth/setup-mfa
// @access  Private
export const setupMfa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select("+mfaSecret");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Generate MFA secret if not already set
    if (!user.mfaSecret) {
      const secret = user.generateMfaSecret();
      await user.save();

      // Generate QR code
      const otpauth = authenticator.keyuri(
        user.email,
        "SOFTEC Management System",
        secret
      );
      const qrCode = await qrcode.toDataURL(otpauth);

      res.status(200).json({
        success: true,
        qrCode,
        secret,
      });
    } else {
      // Generate QR code from existing secret
      const otpauth = authenticator.keyuri(
        user.email,
        "SOFTEC Management System",
        user.mfaSecret
      );
      const qrCode = await qrcode.toDataURL(otpauth);

      res.status(200).json({
        success: true,
        qrCode,
        secret: user.mfaSecret,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Disable MFA
// @route   POST /api/auth/disable-mfa
// @access  Private
export const disableMfa = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new BadRequestError("Please provide MFA code");
    }

    const user = await User.findById(req.user!._id).select("+mfaSecret");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (!user.mfaSecret || !user.mfaEnabled) {
      throw new BadRequestError("MFA is not enabled for this user");
    }

    // Verify the code
    const isValid = authenticator.verify({
      token: code,
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new UnauthorizedError("Invalid MFA code");
    }

    // Disable MFA
    user.mfaEnabled = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "MFA disabled successfully",
    });
  } catch (error) {
    next(error);
  }
};
