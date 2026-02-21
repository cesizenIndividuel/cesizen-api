import jwt from "jsonwebtoken";

export type AccessTokenPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing in .env");
  return secret;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const secret = getJwtSecret();
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "30m") as any; 
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as AccessTokenPayload;
}