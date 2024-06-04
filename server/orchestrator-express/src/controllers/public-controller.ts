import { NextFunction, Request, Response } from "express";
import Category from "../services/category";
import Item from "../services/item";

export default class PublicController {
  static async listCategory(req: Request, res: Response, next: NextFunction) {
    console.log("public list category api...");

    try {
      const categories = await Category.findAll();

      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("public get category api...");

    try {
      const {
        params: { id },
      } = req;

      const category = await Category.findById(id);

      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async listItem(req: Request, res: Response, next: NextFunction) {
    console.log("public list item api...");

    try {
      const items = await Item.findAll();

      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async getItemById(req: Request, res: Response, next: NextFunction) {
    console.log("public get item api...");

    try {
      const {
        params: { id },
      } = req;

      const item = await Item.findById(id);

      res.json(item);
    } catch (error) {
      next(error);
    }
  }
}
