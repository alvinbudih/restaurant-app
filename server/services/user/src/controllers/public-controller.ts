import { NextFunction, Request, Response } from "express";
import UserService from "../services/user-service";
import CustomError from "../helpers/custom-error";

export default class PublicController {
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    console.log("public get user api...");

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
