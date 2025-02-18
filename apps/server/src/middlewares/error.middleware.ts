import { StatusCodes } from "http-status-codes";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ENVS } from "@repo/ui/dist/enums/environment";
// import logger from "../lib/logger";
import config from "../config";
import logger from "../utils/logger";

export class AppError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
    this.stack = config.environment === ENVS.production ? "" : this.stack;
  }
}

export const asyncHandler =
  (fn: any) =>
  (...args: any[]) =>
    fn(...args).catch(args[args.length - 1]);

export const errorHandler: ErrorRequestHandler = (
  error: any | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: "Error occurred",
    error: error.message,
    stack: error.stack,
  });
  const code = error.code || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message;
  // logger.error(error);
  if (!(error instanceof AppError) && config.environment !== ENVS.local) {
    return res.status(code).json({
      message: "The problem is on our end. We are working on fixing it.",
      status: false,
      data: null,
    });
  }

  res.status(code).json({
    message,
    success: false,
    data: null,
  });
};
