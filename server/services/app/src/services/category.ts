import prisma from "../config/prisma";
import validate from "../helpers/validate";
import {
  CreateCategory,
  UpdateCategory,
  categoryPartialSchema,
  categorySchema,
} from "../schemas/category-schema";

export default class Category {
  static async findMany() {
    return await prisma.category.findMany();
  }

  static async findOne(id: string) {
    return await prisma.category.findUniqueOrThrow({ where: { id } });
  }

  static async create(body: CreateCategory) {
    const data = validate(categorySchema, body);

    return await prisma.category.create({ data });
  }

  static async update(id: string, body: UpdateCategory) {
    await prisma.category.findUniqueOrThrow({ where: { id } });
    const data = validate(categoryPartialSchema, body);

    return await prisma.category.update({ where: { id }, data });
  }

  static async destroy(id: string) {
    await prisma.category.findUniqueOrThrow({ where: { id } });

    return await prisma.category.delete({ where: { id } });
  }
}
