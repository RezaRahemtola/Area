export type JwtBasePayload = { iat: number; exp?: number };
export type JwtCustomPayload = { id: string };
export type JwtPayload = JwtBasePayload & JwtCustomPayload;
