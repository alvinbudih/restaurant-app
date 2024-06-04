import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/custom-error";
import { JsonWebTokenError } from "jsonwebtoken";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status: number, msg: string;
  let fieldError: Record<string, any> | null = null;

  switch (true) {
    case error instanceof JsonWebTokenError:
      status = 401;
      msg = error.message;
      break;

    case error instanceof CustomError:
      status = error.status;
      msg = error.message;
      break;

    case error instanceof AxiosError:
      status = error.response!.status;
      msg = error.response!.data.msg;
      if (error.response?.data.fieldError) {
        fieldError = error.response.data.fieldError;
      }
      break;

    default:
      status = 500;
      msg = "Internal Server Error";
      break;
  }

  res.status(status).json({ msg, ...(fieldError && { fieldError }) });
}
