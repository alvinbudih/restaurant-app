import { NextFunction, Request, Response } from "express";
import Category from "../services/category";
import cleanNullishValue from "../helpers/cleanNullishValue";

export default class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list category api...");

    try {
      const categories = await Category.findMany();

      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    console.log("create category api...");

    try {
      const {
        body: { name },
      } = req;

      const payload = cleanNullishValue({ name });

      const result = await Category.create(payload);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    console.log("get category api...");

    try {
      const {
        params: { id },
      } = req;

      const category = await Category.findOne(id);

      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  static async edit(req: Request, res: Response, next: NextFunction) {
    console.log("edit category api...");

    try {
      const {
        body: { name },
        params: { id },
      } = req;

      const payload = cleanNullishValue({ name });

      const result = await Category.update(id, payload);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    console.log("delete category api...");

    try {
      const {
        params: { id },
      } = req;

      const result = await Category.destroy(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
