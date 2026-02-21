import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { registerSchema, loginSchema } from "../validators/auth.validators";
import { authService } from "../services/auth.service";

//Inscription
export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(registerSchema, req.body, res);
  if (!body) return;

  const result = await authService.register(body);

  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  return res.status(201).json(result.user);
});

//Connexion
export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(loginSchema, req.body, res);
  if (!body) return;

  const result = await authService.login(body);

  if (!result.ok) {
    // compte inactif = 403, sinon credentials = 401
    const status = result.error === "ACCOUNT_INACTIVE" ? 403 : 401;
    return res.status(status).json({ error: result.error });
  }

  return res.status(200).json({ token: result.token });
});