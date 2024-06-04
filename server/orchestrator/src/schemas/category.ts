import { AxiosError } from "axios";
import appRequest from "../config/app-server";
import redis from "../config/redis";
import { GraphQLError } from "graphql";
import isAuthenticated from "../middlewares/isAuthenticated";

type Category = {
  id: string;
  name: string;
};

export const typeDefs = `#graphql
  type Category {
    id: ID
    name: String
  }

  input PayloadCategory {
    name: String
  }

  type Query {
    getAllCategories: [Category]
    getOneCategory(id: String!): Category
  }

  type Mutation {
    addCategory(data: PayloadCategory!): Category
    editCategory(id: ID!, data: PayloadCategory!): Category
    deleteCategory(id: ID!): Category
  }
`;

export const resolvers = {
  Query: {
    async getAllCategories(): Promise<Array<Category>> {
      try {
        let categories: Array<Category> | string | null = await redis.get(
          "categories"
        );

        if (!categories) {
          const { data } = await appRequest<Array<Category>>({
            method: "GET",
            url: "/categories",
          });

          categories = data;
        } else {
          categories = JSON.parse(categories) as Array<Category>;
        }

        await redis.set("categories", JSON.stringify(categories));
        return categories;
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

    async getOneCategory(_, args): Promise<Category> {
      try {
        const { id } = args;
        let category: Category | string | null = await redis.get(
          `category:${id}`
        );

        if (!category) {
          const { data } = await appRequest<Category>({
            method: "GET",
            url: `/categories/${id}`,
          });

          category = data;
        } else {
          category = JSON.parse(category) as Category;
        }

        await redis.set(`category:${id}`, JSON.stringify(category));
        return category;
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
    async addCategory(_, args, context) {
      try {
        await isAuthenticated(context.token);

        const { data } = args;

        const { data: result } = await appRequest({
          method: "POST",
          url: "/categories",
          data,
        });

        await redis.del("categories");

        return result;
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

    async editCategory(_, args, context) {
      try {
        await isAuthenticated(context.token);

        const { id, data } = args;

        const { data: result } = await appRequest({
          method: "PATCH",
          url: `/categories/${id}`,
          data,
        });

        await redis.del("categories");
        await redis.del(`category:${id}`);

        return result;
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

    async deleteCategory(_, args, context) {
      try {
        await isAuthenticated(context.token);

        const { id } = args;

        const { data: result } = await appRequest({
          method: "DELETE",
          url: `/categories/${id}`,
        });

        await redis.del("categories");
        await redis.del(`category:${id}`);

        return result;
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
