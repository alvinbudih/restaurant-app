import { NextFunction, Request, Response } from "express";
import Item from "../services/item";
import cleanNullishValue from "../helpers/cleanNullishValue";

export default class ItemController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    console.log("list item api...");

    try {
      const items = await Item.findMany();

      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    console.log("create item api...");

    try {
      const {
        body: {
          name,
          description,
          price,
          imgUrl,
          AuthorId,
          CategoryId,
          Ingredients,
        },
      } = req;

      const payload = cleanNullishValue({
        name,
        description,
        price,
        imgUrl,
        AuthorId,
        CategoryId,
        Ingredients: Ingredients?.map((ingredient: any) =>
          cleanNullishValue(ingredient)
        ),
      });

      const result = await Item.create(payload);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    console.log("get item api...");

    try {
      const {
        params: { id },
      } = req;

      const item = await Item.findOne(id);

      res.json(item);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    console.log("edit item api...");

    try {
      const {
        params: { id },
        body: { name, description, price, imgUrl, CategoryId },
      } = req;

      const payload = cleanNullishValue({
        name,
        description,
        price,
        imgUrl,
        CategoryId,
      });

      const result = await Item.edit(id, payload);

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

      const result = await Item.destroy(id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
