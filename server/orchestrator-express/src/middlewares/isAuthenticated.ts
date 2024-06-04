import { NextFunction, Request, Response } from "express";
import User from "../services/user";
import CustomError from "../helpers/custom-error";
import verifyToken from "../helpers/verifyToken";
import PayloadToken from "../interfaces/PayloadToken";
import CustomRequest from "../interfaces/CustomRequest";

export default async function isAuthentiecated(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

    const user = await User.findById(payload.id, authorization);

    (req as CustomRequest).user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: authorization,
    };

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
}
