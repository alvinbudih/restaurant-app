import { NextFunction, Request, Response } from "express";
import Category from "../services/category";

export default class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list category api...");

    try {
      const categories = await Category.findAll();

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

      const result = await Category.create({ name });

      res.json(result);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    console.log("get category api...");

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

  static async update(req: Request, res: Response, next: NextFunction) {
    console.log("update category api...");

    try {
      const {
        params: { id },
        body: { name },
      } = req;

      const result = await Category.update(id, { name });

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

      const result = await Category.remove(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
