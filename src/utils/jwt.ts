import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";

//ce qu'on met dans le JWT
export type AccessTokenPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

//Récupere la clée secrète (.env)
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing in .env");
  return secret;
}

// ================= ACCESS TOKEN =================

export function signAccessToken(payload: AccessTokenPayload): string {
  const secret = getJwtSecret();

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "30m") as SignOptions["expiresIn"];
  const options: SignOptions = { expiresIn };

  return jwt.sign(payload, secret, options);
}
// verifie secret, expiration, si ok => renvoie payload
export function verifyAccessToken(token: string): AccessTokenPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as AccessTokenPayload;
}

// ================= REFRESH TOKEN =================

//Creer un chaine aléatoire (64 octets) convertit en hexadécimal
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

//hasher le token avant de le stocker en base
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

//Calcule la date d'expiration 
export function getRefreshExpiresAt(): Date {
  const days = Number(process.env.REFRESH_TOKEN_DAYS ?? "7");
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}