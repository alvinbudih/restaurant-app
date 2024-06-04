import { NextFunction, Request, Response } from "express";
import User from "../services/user";
import CustomRequest from "../interfaces/CustomRequest";

export default class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    console.log("register api...");

    try {
      const {
        body: { username, email, password, phoneNumber, address },
      } = req;

      const data = await User.register({
        username,
        email,
        password,
        phoneNumber,
        address,
      });

      res.status(201).json(data);
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

      const data = await User.login({ email, password });

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list user api...");

    try {
      const {
        user: { token },
      } = req as CustomRequest;

      const users = await User.findAll(token);

      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    console.log("get user api...");

    try {
      const {
        params: { id },
        user: { token },
      } = req as CustomRequest;

      const user = await User.findById(id, token);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
