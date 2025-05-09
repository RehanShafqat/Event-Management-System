import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    // Mongoose duplicate key error
    else if (err.name === "MongoError" && (err as any).code === 11000) {
      res.status(409).json({
        success: false,
        error: "Duplicate field value entered",
      });
    }
    // JWT errors
    else if (err.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    } else if (err.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        error: "Token expired",
      });
    }
    // Default to 500 server error
    else {
      res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};
