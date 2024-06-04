import prisma from "../config/prisma";
import validate from "../helpers/validate";
import {
  CreateItem,
  UpdateItem,
  itemPartialSchema,
  itemSchema,
} from "../schemas/item-schema";

export default class Item {
  static async findMany() {
    return await prisma.item.findMany();
  }

  static async findOne(id: string) {
    return await prisma.item.findUniqueOrThrow({
      where: { id },
      include: { Category: true, Ingredients: true },
    });
  }

  static async create(body: CreateItem) {
    const data = validate(itemSchema, body);

    return await prisma.item.create({
      data: {
        ...data,
        Ingredients: {
          createMany: {
            data: data.Ingredients,
          },
        },
      },
      include: {
        Ingredients: true,
      },
    });
  }

  static async edit(id: string, body: UpdateItem) {
    await prisma.item.findUniqueOrThrow({ where: { id } });
    const data = validate(itemPartialSchema, body);

    return await prisma.item.update({ where: { id }, data });
  }

  static async destroy(id: string) {
    await prisma.item.findUniqueOrThrow({ where: { id } });

    return await prisma.item.delete({ where: { id } });
  }
}
