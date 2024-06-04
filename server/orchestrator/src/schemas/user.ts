import { AxiosError } from "axios";
import userRequest from "../config/user-server";
import redis from "../config/redis";
import isAuthenticated from "../middlewares/isAuthenticated";
import { GraphQLError } from "graphql";

type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
};

export const typeDefs = `#graphql
  type User {
    _id: ID
    username: String
    email: String
    role: String
    phoneNumber: String
    address: String
  }

  type LoginResponse {
    token: String
  }

  input PayloadUser {
    username: String
    email: String
    password: String
    phoneNumber: String
    address: String
  }

  input PayloadLogin {
    email: String
    password: String
  }

  type Query {
    getAllUsers: [User]
    getOneUser(id: ID): User
  }

  type Mutation {
    register(body: PayloadUser): User
    login(body: PayloadLogin): LoginResponse
  }
`;

export const resolvers = {
  Query: {
    async getAllUsers(parent, args, contextValue): Promise<Array<User>> {
      try {
        await isAuthenticated(contextValue.token);

        let users: Array<User> | string | null = await redis.get("users");

        if (!users) {
          const { data } = await userRequest<Array<User>>({
            method: "GET",
            url: "/users",
            headers: {
              Authorization: contextValue.token,
            },
          });

          users = data;
        } else {
          users = JSON.parse(users) as Array<User>;
        }

        await redis.set("users", JSON.stringify(users));
        return users;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          return error.response?.data;
        }

        return error;
      }
    },
    async getOneUser(parent, args, contextValue): Promise<User> {
      try {
        await isAuthenticated(contextValue.token);

        const { id } = args;

        let user: User | string | null = await redis.get(`user:${id}`);

        if (!user) {
          const { data } = await userRequest<User>({
            method: "GET",
            url: `/users/${id}`,
            headers: {
              Authorization: contextValue.token,
            },
          });

          user = data;
        } else {
          user = JSON.parse(user) as User;
        }

        await redis.set(`user:${id}`, JSON.stringify(user));
        return user;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          throw new GraphQLError(error.response?.data.msg, {
            extensions: {
              code: error.code,
              http: { status: error.response?.status },
            },
          });
        }

        throw error;
      }
    },
  },

  Mutation: {
    async register(_, args) {
      try {
        const {
          body: { username, email, password, phoneNumber, address },
        } = args;

        const { data } = await userRequest({
          method: "POST",
          url: "/register",
          data: {
            username,
            email,
            password,
            phoneNumber,
            address,
          },
        });

        await redis.del("users");

        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new GraphQLError(error.response?.data.msg, {
            extensions: {
              code: error.code,
              http: { status: error.response?.status },
            },
          });
        }

        throw error;
      }
    },

    async login(_, args) {
      try {
        const {
          body: { email, password },
        } = args;

        const { data } = await userRequest({
          method: "POST",
          url: "/login",
          data: { email, password },
        });

        return data;
      } catch (error: any) {
        if (error instanceof AxiosError) {
          throw new GraphQLError(error.response?.data.msg, {
            extensions: {
              code: error.code,
              http: { status: error.response?.status },
            },
          });
        }

        throw error;
      }
    },
  },
};
