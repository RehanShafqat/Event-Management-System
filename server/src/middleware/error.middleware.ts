import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If it's our custom error, use its status code and message
  if (err instanceof CustomError) {
    logger.error(`[${err.constructor.name}] ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.constructor.name,
    });
  }

  // For mongoose validation errors
  if (err.name === "ValidationError") {
    logger.error(`[ValidationError] ${err.message}`);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: "ValidationError",
      details: err.message,
    });
  }

  // For mongoose duplicate key errors
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    logger.error(`[DuplicateKeyError] ${err.message}`);
    return res.status(409).json({
      success: false,
      message: "Duplicate Entry",
      error: "DuplicateKeyError",
      details: err.message,
    });
  }

  // For JWT errors
  if (err.name === "JsonWebTokenError") {
    logger.error(`[JWTError] ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: "JWTError",
    });
  }

  if (err.name === "TokenExpiredError") {
    logger.error(`[TokenExpiredError] ${err.message}`);
    return res.status(401).json({
      success: false,
      message: "Token expired",
      error: "TokenExpiredError",
    });
  }

  // For any other errors
  logger.error(`[InternalServerError] ${err.message}`);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: "InternalServerError",
  });
};
