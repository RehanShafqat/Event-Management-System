import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/CustomError";
import User from "../models/user.model";
import { IUser, Role } from "../types/user.types";

interface DecodedToken {
  id: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

//INFO: Just verifies the token and whether the user is present or not
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Get token from cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedError("Not authorized to access this route");
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Get user from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("User not found"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Not authorized to access this route"));
    }

    next();
  };
};

// Middleware to check if user is in hierarchy chain
export const checkHierarchy = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { user } = req;
    const { subordinateId } = req.params;

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // President can access all users
    if (user.role === "President") {
      return next();
    }

    // Check if the subordinate user is in the hierarchy chain
    const isInHierarchy = user.subordinates.includes(subordinateId);

    if (!isInHierarchy) {
      throw new ForbiddenError("Not authorized to access this user");
    }

    next();
  } catch (error) {
    next(error);
  }
};
