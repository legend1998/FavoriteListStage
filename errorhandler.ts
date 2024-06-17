import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    // Set the prototype explicitly to maintain the instanceof check
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

interface ErrorWithStatus extends Error {
  status?: number;
  errors?: { [key: string]: string };
}

const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof mongoose.Error.ValidationError) {
    const validationErrors: { [key: string]: string } = {};
    Object.keys(err.errors).forEach((key) => {
      validationErrors[key] = err.errors[key].message;
    });
    return res.status(400).json({ errors: validationErrors });
  }

  if (err instanceof mongoose.Error) {
    return res.status(500).json({ error: "A database error occurred" });
  }

  if (err instanceof CustomError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "An unknown error occurred",
  });
};

export { errorHandler, CustomError };
