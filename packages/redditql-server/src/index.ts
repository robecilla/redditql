import "reflect-metadata";
import "dotenv-safe/config";

import express from "express";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { COOKIE_NAME, isProd } from "./constants";
import { Context } from "./types";

async function main() {
  const prisma = new PrismaClient({
    log: ["query", "warn"],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  // tell express that we have a proxy setting in front
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        // @ts-ignore
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        domain: isProd ? ".chorbo.rocks" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({
      prisma,
      req,
      res,
      redis,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = parseInt(process.env.PORT);
  app.listen(port, () => console.log(`Server started on localhost:${port}`));
}

main().catch((err) => console.log(err));
