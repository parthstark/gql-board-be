import { ApolloServer } from "apollo-server";
import { db } from "./db";
import { typeDefs } from "./gql-config/schema";
import { resolvers } from "./gql-config/resolvers";

const start = async () => {
  await db.read(); // initialize

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      return {
        message: err.message,
        code: err.extensions?.code,
      };
    },
  });
  const { url } = await server.listen({ port: 4000 });
  console.log(`🚀 Server running at ${url}`);
};

start();
