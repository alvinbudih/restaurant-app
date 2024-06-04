import { NextFunction, Request, Response } from "express";
import UserService from "../services/user-service";
import CustomError from "../helpers/custom-error";

export default class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list user api...");

    try {
      const users = await UserService.findAll();

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
      } = req;

      const user = await UserService.findById(id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
