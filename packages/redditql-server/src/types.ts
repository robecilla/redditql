import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export type Context = {
  prisma: PrismaClient;
  req: Request;
  res: Response;
};
