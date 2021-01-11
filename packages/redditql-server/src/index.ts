import "reflect-metadata";

import express from "express";
import cors from "cors";
import redis from "redis";
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
  const prisma = new PrismaClient();
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
      },
      saveUninitialized: false,
      secret: "lhdakjfhaskjdhfajksdf",
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
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => console.log("Server started on localhost:4000"));
}

main().catch((err) => console.log(err));
