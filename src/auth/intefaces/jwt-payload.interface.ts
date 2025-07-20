export interface JwtPayload {
  sub: number;
  role: 'USER' | 'ADMIN';
  id: number;
  iat?: number;
  exp?: number;
}
