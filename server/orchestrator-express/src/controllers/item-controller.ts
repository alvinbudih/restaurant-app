import { NextFunction, Request, Response } from "express";
import Item from "../services/item";
import CustomRequest from "../interfaces/CustomRequest";

export default class ItemController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list item api...");

    try {
      const items = await Item.findAll();

      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    console.log("create item api...");

    try {
      const {
        body: { name, description, price, imgUrl, CategoryId, Ingredients },
        user: { id: AuthorId },
      } = req as CustomRequest;

      const result = await Item.create({
        name,
        description,
        price,
        imgUrl,
        CategoryId,
        AuthorId,
        Ingredients,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    console.log("get item api...");

    try {
      const {
        params: { id },
      } = req as CustomRequest;

      const item = await Item.findById(id);

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    console.log("update item api...");

    try {
      const {
        body: { name, description, price, imgUrl, CategoryId },
        params: { id },
      } = req;

      const result = await Item.update(id, {
        name,
        description,
        price,
        imgUrl,
        CategoryId,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req: Request, res: Response, next: NextFunction) {
    console.log("delete item api...");

    try {
      const {
        params: { id },
      } = req;

      const result = await Item.remove(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
