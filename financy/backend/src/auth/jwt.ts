import jwt from 'jsonwebtoken';

export type TokenPayload = { userId: string };

const EXPIRES_IN = '7d';

export const signToken = (payload: TokenPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign(payload, secret, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  const decoded = jwt.verify(token, secret) as TokenPayload;
  return { userId: decoded.userId };
};
