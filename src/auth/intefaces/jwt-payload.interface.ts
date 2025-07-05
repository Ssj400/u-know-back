export interface JwtPayload {
  sub: number;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
}
