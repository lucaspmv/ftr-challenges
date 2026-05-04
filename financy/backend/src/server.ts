import 'dotenv/config';
import express from 'express';
import http from 'node:http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'node:path';
import { buildContext } from './context';
import { resolvers } from './resolvers';

const typeDefs = loadFilesSync(path.join(__dirname, 'schema.graphql'));

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const apollo = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apollo.start();

  app.use(
    '/graphql',
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
      credentials: true,
    }),
    cookieParser(),
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req, res }) => buildContext({ req, res }),
    }),
  );

  const port = Number(process.env.PORT ?? 4000);
  httpServer.listen(port, () => {
    console.log(`Financy backend ready at http://localhost:${port}/graphql`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
