import { Request } from 'express';

export const cookieExtractor = (req: {
  cookies: { [key: string]: string };
}) => {
  let jwt: string | null = null;

  if (req && req.cookies) {
    jwt = req.cookies['jwt'];
  }

  return jwt;
};

export const refreshTokenCookieExtractor = (req: {
  cookies: { [key: string]: string };
}) => {
  let refreshToken: string | null = null;

  if (req && req.cookies) {
    refreshToken = req.cookies['refresh_token'];
  }

  return refreshToken;
};
