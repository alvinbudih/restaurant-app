import { NextFunction, Request, Response } from "express";
import cleanNullishValue from "../helpers/cleanNullishValue";
import UserService from "../services/user-service";

export default class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    console.log("register api...");

    try {
      const {
        body: { username, email, password, phoneNumber, address },
      } = req;

      const payload = cleanNullishValue({
        username,
        email,
        password,
        role: "admin",
        phoneNumber,
        address,
      });

      const result = await UserService.register(payload);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    console.log("login api...");

    try {
      const {
        body: { email, password },
      } = req;

      const payload = cleanNullishValue({ email, password });

      const result = await UserService.login(payload);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
