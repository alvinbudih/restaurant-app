import appRequest from "../configs/app-request";
import redis from "../configs/redis";
import {
  CategoryPayload,
  CreateCategory,
  UpdateCategory,
} from "../schemas/category-schema";

export default class Category {
  static async findAll(): Promise<Array<CategoryPayload>> {
    let result: Array<CategoryPayload> | string | null = await redis.get(
      "categories"
    );

    if (!result) {
      const { data } = await appRequest<Array<CategoryPayload>>({
        method: "GET",
        url: "/categories",
      });

      await redis.set("categories", JSON.stringify(data));
      result = data;
    } else {
      result = JSON.parse(result) as Array<CategoryPayload>;
    }

    return result;
  }

  static async findById(id: string): Promise<CategoryPayload> {
    let result: CategoryPayload | string | null = await redis.get(
      `category:${id}`
    );

    if (!result) {
      const { data } = await appRequest<CategoryPayload>({
        method: "GET",
        url: `/categories/${id}`,
      });

      await redis.set(`category:${id}`, JSON.stringify(data));
      result = data;
    } else {
      result = JSON.parse(result) as CategoryPayload;
    }

    return result;
  }

  static async create(data: CreateCategory) {
    const { data: result } = await appRequest<CategoryPayload>({
      method: "POST",
      url: "/categories",
      data,
    });

    await redis.del("categories");

    return result;
  }

  static async update(id: string, data: UpdateCategory) {
    const { data: result } = await appRequest<CategoryPayload>({
      method: "PATCH",
      url: `/categories/${id}`,
      data,
    });

    await redis.del("categories");
    await redis.del(`category:${id}`);

    return result;
  }

  static async remove(id: string) {
    const { data } = await appRequest<CategoryPayload>({
      method: "DELETE",
      url: `/categories/${id}`,
    });

    await redis.del("categories");
    await redis.del(`category:${id}`);

    return data;
  }
}
