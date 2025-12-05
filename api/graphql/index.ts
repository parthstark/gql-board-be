import { ApolloServer } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { db } from "../../src/db";
import { apolloConfig } from "../../src/apollo-config";

const server = new ApolloServer({
  ...apolloConfig,
  context: async () => {
    await db.read();
    return { db };
  },
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  cache: "bounded",
  persistedQueries: false,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = server.start();

export default async function handler(req: any, res: any) {
  await startServer;
  return server.createHandler({ path: "/api/graphql" })(req, res);
}
