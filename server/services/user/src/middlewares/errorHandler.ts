import { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/custom-error";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let msg: string, status: number;
  const fieldError: Record<string, string> = {};

  switch (true) {
    case error instanceof CustomError:
      msg = error.message;
      status = error.status;
      break;

    case error instanceof ZodError:
      status = 400;
      msg = "Bad Request";
      for (const key in error.formErrors.fieldErrors) {
        fieldError[key] = error.formErrors.fieldErrors[key]![0];
      }
      break;

    case error instanceof JsonWebTokenError:
      msg = error.message;
      status = 401;
      break;

    default:
      msg = "Internal Server Error";
      status = 500;
      break;
  }

  res
    .status(status)
    .json({ msg, ...(error instanceof ZodError && { fieldError }) });
}
