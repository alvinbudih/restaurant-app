import appRequest from "../configs/app-request";
import redis from "../configs/redis";
import userRequest from "../configs/user-request";
import {
  CreateItemPayload,
  ItemPayload,
  UpdateItemPayload,
} from "../schemas/item-schema";
import { UserPayload } from "../schemas/user-schema";

export default class Item {
  static async findAll(): Promise<Array<ItemPayload>> {
    let items: Array<ItemPayload> | string | null = await redis.get("items");

    if (!items) {
      const { data } = await appRequest<Array<ItemPayload>>({
        method: "GET",
        url: "/items",
      });

      await redis.set("items", JSON.stringify(data));
      items = data;
    } else {
      items = JSON.parse(items) as Array<ItemPayload>;
    }

    return items;
  }

  static async create(data: CreateItemPayload) {
    const { data: result } = await appRequest<ItemPayload>({
      method: "POST",
      url: "/items",
      data,
    });

    await redis.del("items");

    return result;
  }

  static async findById(id: string): Promise<ItemPayload> {
    let item: ItemPayload | string | null = await redis.get(`item:${id}`);

    if (!item) {
      const { data } = await appRequest<ItemPayload>({
        method: "GET",
        url: `/items/${id}`,
      });

      let Author: UserPayload | string | null = await redis.get(
        `user:${data.AuthorId}`
      );

      if (!Author) {
        const { data: user } = await userRequest<UserPayload>({
          method: "GET",
          url: `/public/users/${data.AuthorId}`,
        });

        Author = user;
        await redis.set(`user:${user._id}`, JSON.stringify(user));
      } else {
        Author = JSON.parse(Author) as UserPayload;
      }

      item = data;
      item.Author = Author;

      await redis.set(`item:${id}`, JSON.stringify(data));
    } else {
      item = JSON.parse(item) as ItemPayload;
    }

    return item;
  }

  static async update(id: string, data: UpdateItemPayload) {
    const { data: result } = await appRequest<ItemPayload>({
      method: "PATCH",
      url: `/items/${id}`,
      data,
    });

    await redis.del("items");
    await redis.del(`item:${id}`);

    return result;
  }

  static async remove(id: string) {
    const { data } = await appRequest<UserPayload>({
      method: "DELETE",
      url: `/items/${id}`,
    });

    await redis.del("items");
    await redis.del(`item:${id}`);

    return data;
  }
}
