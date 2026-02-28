import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { registerSchema, loginSchema } from "../validators/auth.validators";
import { authService } from "../services/auth.service";import { prisma } from "../db/prisma";
import { hashRefreshToken, generateRefreshToken, getRefreshExpiresAt, signAccessToken } from "../utils/jwt";

//----------------------------------//
//            Inscription           //
//----------------------------------//
export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(registerSchema, req.body, res);
  if (!body) return;

  const result = await authService.register(body);

  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  return res.status(201).json(result.user);
});

//----------------------------------//
//            Connexion             //
//----------------------------------//
export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(loginSchema, req.body, res);
  if (!body) return;

  const result = await authService.login(body);

  if (!result.ok) {
    // compte inactif = 403, sinon credentials = 401
    const status = result.error === "ACCOUNT_INACTIVE" ? 403 : 401;
    return res.status(status).json({ error: result.error });
  }

  // refresh token dans un cookie sécurisé
  res.cookie("refresh_token", result.refreshToken, {
    httpOnly: true, //faille xss (injection JS)
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", //faille CSRF (use cookie pour faire une action à ma place)
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    accessToken: result.accessToken,
    user: result.user,
  });
});

//----------------------------------//
//           Refresh token          //
//----------------------------------//
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token; //token stoché dans cookie

  //si pas de cookie
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const tokenHash = hashRefreshToken(token); //on hash le token pour le comparer a la BDD

  //on cherche le refresh token en BDD + user
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  // token inconnu ou déjà révoqué
  if (!existing || existing.revokedAt) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  // expiré
  if (existing.expiresAt < new Date()) {
    return res.status(401).json({ error: "REFRESH_EXPIRED" });
  }

  // Rotation : on révoque l’ancien refresh
  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date() },
  });

  // On crée un nouveau refresh token
  const newRefresh = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      tokenHash: hashRefreshToken(newRefresh),
      userId: existing.userId,
      expiresAt: getRefreshExpiresAt(),
    },
  });

  // Nouveau access token
  const accessToken = signAccessToken({
    userId: existing.userId,
    role: existing.user.role,
  });

  // Nouveau cookie refresh dans un cookie
  res.cookie("refresh_token", newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ accessToken });
});

//----------------------------------//
//              Logout              //
//----------------------------------//
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refresh_token;

  await authService.logout(refreshToken);

  //suppression du cookie coté navigateur
  res.clearCookie("refresh_token", {
    path: "/api/auth",
  });

  return res.status(204).send();
});