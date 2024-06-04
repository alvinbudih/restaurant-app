import redis from "../configs/redis";
import userRequest from "../configs/user-request";
import {
  LoginPayload,
  RegisterPayload,
  UserPayload,
} from "../schemas/user-schema";

export default class User {
  static async register(data: RegisterPayload) {
    const { data: result } = await userRequest<UserPayload>({
      method: "POST",
      url: "/register",
      data,
    });

    await redis.del("users");

    return result;
  }

  static async login(data: LoginPayload) {
    const { data: result } = await userRequest<UserPayload>({
      method: "POST",
      url: "/login",
      data,
    });

    return result;
  }

  static async findAll(token: string): Promise<Array<UserPayload>> {
    let users: Array<UserPayload> | string | null = await redis.get("users");

    if (!users) {
      const { data } = await userRequest<Array<UserPayload>>({
        method: "GET",
        url: "/users",
        headers: {
          Authorization: token,
        },
      });

      users = data;
      await redis.set("users", JSON.stringify(data));
    } else {
      users = JSON.parse(users) as Array<UserPayload>;
    }

    return users;
  }

  static async findById(id: string, token: string): Promise<UserPayload> {
    let user: UserPayload | string | null = await redis.get(`user:${id}`);

    if (!user) {
      const { data } = await userRequest<UserPayload>({
        method: "GET",
        url: `/users/${id}`,
        headers: {
          Authorization: token,
        },
      });

      user = data;
      await redis.set(`user:${id}`, JSON.stringify(data));
    } else {
      user = JSON.parse(user) as UserPayload;
    }

    return user;
  }
}
