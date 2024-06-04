import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number;
  let msg: string;
  let fieldError: Record<string, string> = {};

  switch (true) {
    case error instanceof PrismaClientKnownRequestError:
      status = 404;
      msg = error.message;
      break;

    case error instanceof ZodError:
      status = 400;
      msg = "Bad Request";
      for (const key in error.formErrors.fieldErrors) {
        fieldError[key] = error.formErrors.fieldErrors[key]![0];
      }
      break;

    default:
      status = 500;
      msg = "Internal Server Error";
      break;
  }

  res.status(status).json({ msg, ...(status === 400 && { fieldError }) });
}
