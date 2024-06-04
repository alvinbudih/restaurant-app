import { NextFunction, Request, Response } from "express";
import CustomError from "../helpers/custom-error";
import verifyToken from "../helpers/verifyToken";
import CustomRequest from "../interfaces/custom-request";
import PayloadToken from "../interfaces/payload-token";
import UserService from "../services/user-service";
import User from "../models/user";

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("is authenticated middleware");

  try {
    const {
      headers: { authorization },
    } = req;

    if (!authorization) {
      throw new CustomError("Unauthenticated", 401);
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw new CustomError("Unauthenticated", 401);
    }

    const payload = verifyToken(token) as PayloadToken;

    const user = await User.findById(payload.id);

    if (!user) {
      throw new CustomError("Unauthenticated", 401);
    }

    (req as CustomRequest).user = payload;

    next();
  } catch (error) {
    next(error);
    console.log(error);
  }
}
