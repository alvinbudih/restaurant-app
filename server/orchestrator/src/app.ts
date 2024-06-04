import "dotenv/config";
import { ApolloServer, BaseContext, ContextFunction } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  typeDefs as itemTypeDefs,
  resolvers as itemResolvers,
} from "./schemas/item";

import {
  typeDefs as categoryTypeDefs,
  resolvers as categoryResolvers,
} from "./schemas/category";
import {
  typeDefs as userTypeDefs,
  resolvers as userResolvers,
} from "./schemas/user";

const port = Number(process.env.PORT) || 4000;

interface Context extends BaseContext {
  token?: string;
}

const server = new ApolloServer<Context>({
  typeDefs: [itemTypeDefs, categoryTypeDefs, userTypeDefs],
  resolvers: [itemResolvers, categoryResolvers, userResolvers],
});

startStandaloneServer(server, {
  listen: { port },
  async context({ req }) {
    return {
      token: req.headers.authorization,
    };
  },
}).then(({ url }) => {
  console.clear();
  console.log(`GraphQL Server ready at ${url}`);
});
