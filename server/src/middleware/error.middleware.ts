import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the full error details including stack trace
  logger.error({
    message: `[${err.constructor.name}] ${err.message}`,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user ? req.user._id : "unauthenticated",
  });

  // If it's our custom error, use its status code and message
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.constructor.name,
    });
  }

  // For mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      error: "ValidationError",
      details: err.message,
    });
  }

  // For mongoose duplicate key errors
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate Entry",
      error: "DuplicateKeyError",
      details: err.message,
    });
  }

  // For JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: "JWTError",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      error: "TokenExpiredError",
    });
  }

  // For any other errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: "InternalServerError",
  });
};
