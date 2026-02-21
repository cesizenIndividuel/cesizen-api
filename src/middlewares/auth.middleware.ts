import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  //Récupérer le header Authorization 
  const authHeader = req.headers.authorization;

  //Extraire le token
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Missing token" });
  }

  //Verifier le token 
  try {
    const payload = verifyAccessToken(token);
    req.auth = payload; // { userId, role }
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}