import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle known error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  } else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate entry';
      details = { field: prismaError.meta?.target };
    } else if (prismaError.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    details,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      raw: err
    })
  });
}