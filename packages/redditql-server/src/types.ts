import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

export type Context = {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  redis: Redis;
};
