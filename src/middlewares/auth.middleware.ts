import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  //Récupérer le header Authorization 
  console.log("[AUTH] has Authorization header?", !!req.headers.authorization);
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
    const decoded = jwt.decode(token) as any;
    console.log("[AUTH] exp =", decoded?.exp, "now =", Math.floor(Date.now() / 1000));

    const payload = verifyAccessToken(token);
    req.auth = payload; // { userId, role }
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token" });
  }
}