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
  const token = req.cookies?.refresh_token;

  const result = await authService.refresh(token);

  if (!result.ok) {
    const status = result.error === "REFRESH_EXPIRED" ? 401 : 401;
    return res.status(status).json({ error: result.error });
  }

  // On remet le nouveau refresh dans le cookie
  res.cookie("refresh_token", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    accessToken: result.accessToken,
  });
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