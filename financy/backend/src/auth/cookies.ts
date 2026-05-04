import type { Response } from 'express';

const COOKIE_NAME = 'financy_token';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const setAuthCookie = (
  res: Response,
  token: string,
  rememberMe: boolean,
) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    ...(rememberMe ? { maxAge: SEVEN_DAYS } : {}),
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
};

export const readAuthCookie = (cookies: Record<string, string | undefined>) =>
  cookies[COOKIE_NAME];
