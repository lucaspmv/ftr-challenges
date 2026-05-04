import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';
import { verifyToken } from './auth/jwt';
import { readAuthCookie } from './auth/cookies';

export type GraphQLContext = {
  prisma: PrismaClient;
  userId: string | null;
  req: Request;
  res: Response;
};

export const buildContext = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): GraphQLContext => {
  const token = readAuthCookie(req.cookies ?? {});
  let userId: string | null = null;
  if (token) {
    try {
      userId = verifyToken(token).userId;
    } catch {
      userId = null;
    }
  }
  return { prisma, userId, req, res };
};
