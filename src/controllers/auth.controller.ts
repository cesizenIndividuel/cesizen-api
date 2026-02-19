import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { registerSchema } from "../validators/auth.validators";
import { authService } from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(registerSchema, req.body, res);
  if (!body) return;

  const result = await authService.register(body);

  if (!result.ok) {
    // pseudo ou email déjà pris
    return res.status(409).json({ error: result.error });
  }

  return res.status(201).json(result.user);
});
