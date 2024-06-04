import { AxiosError } from "axios";
import appRequest from "../config/app-server";
import redis from "../config/redis";
import userRequest from "../config/user-server";
import { GraphQLError } from "graphql";
import isAuthenticated from "../middlewares/isAuthenticated";

type Author = {
  _id: string;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
};

type Category = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  imgUrl: string;
  AuthorId: string;
  Author?: Author;
  CategoryId: string;
  Category?: Category;
};

export const typeDefs = `#graphql
  type Author {
    _id: ID
    username: String
    email: String
    role: String
    phoneNumber: String
    address: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Item {
    id: ID!
    name: String!
    description: String!
    price: Int!
    imgUrl: String!
    AuthorId: String!
    Author: Author
    CategoryId: String!
    Category: Category
    Ingredients: [Ingredient]
  }

  type Ingredient {
    id: ID
    ItemId: String
    name: String
  }

  input PayloadItem {
    name: String!
    description: String!
    price: String!
    imgUrl: String!
    CategoryId: String!
    Ingredients: [PayloadIngredient]
  }

  input PayloadIngredient {
    name: String
  }

  type Query {
    getAllItems: [Item]
    getOneItem(id: ID!): Item
  }

  type Mutation {
    addItem(data: PayloadItem): Item
    editItem(id: ID, data: PayloadItem): Item
    deleteItem(id: ID): Item
  }
`;

export const resolvers = {
  Query: {
    async getAllItems(): Promise<Array<Item>> {
      try {
        let items: Array<Item> | string | null = await redis.get("items");

        if (!items) {
          const { data } = await appRequest<Array<Item>>({
            method: "GET",
            url: "/items",
          });

          items = data;
        } else {
          items = JSON.parse(items) as Array<Item>;
        }

        await redis.set("items", JSON.stringify(items));
        return items;
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

    async getOneItem(parent, args): Promise<Item> {
      try {
        const { id } = args;
        let item: Item | string | null = await redis.get(`item:${id}`);

        if (!item) {
          const { data } = await appRequest<Item>({
            method: "GET",
            url: `/items/${id}`,
          });

          item = data;

          let user: Author | string | null = await redis.get(
            `user:${item.AuthorId}`
          );

          if (!user) {
            const { data } = await userRequest<Author>({
              method: "GET",
              url: `/public/users/${item.AuthorId}`,
            });

            user = data;
          } else {
            user = JSON.parse(user) as Author;
          }

          item.Author = user;
        } else {
          item = JSON.parse(item) as Item;
        }

        await redis.set(`item:${id}`, JSON.stringify(item));
        return item;
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
    async addItem(_, args, context) {
      try {
        const user = await isAuthenticated(context.token);

        const { data } = args;

        const { data: result } = await appRequest({
          method: "POST",
          url: "/items",
          data: { ...data, AuthorId: user._id },
        });

        await redis.del("items");

        return result;
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

    async editItem(_, args, context) {
      try {
        await isAuthenticated(context.token);

        const { id, data } = args;

        const { data: result } = await appRequest({
          method: "PATCH",
          url: `/items/${id}`,
          data,
        });

        await redis.del("items");
        await redis.del(`item:${id}`);

        return result;
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

    async deleteItem(_, args, context) {
      try {
        await isAuthenticated(context.token);

        const { id } = args;

        const { data: result } = await appRequest({
          method: "DELETE",
          url: `/items/${id}`,
        });

        await redis.del("items");
        await redis.del(`item:${id}`);

        return result;
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
  },
};
