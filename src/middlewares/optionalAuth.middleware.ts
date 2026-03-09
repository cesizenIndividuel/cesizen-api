import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export function optionalAuth(req: Request, res: Response, next: NextFunction) {

  //Récupérer le header Authorization
  const authHeader = req.headers.authorization;

  //Extraire le token
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

  //Si pas de token → on laisse passer
  if (!token) {
    return next();
  }

  try {
    //Verifier le token
    const payload = verifyAccessToken(token);

    //Ajouter les infos utilisateur dans req.auth
    req.auth = payload;

  } catch {
    //Si token invalide → on ignore pour laisser la route publique
  }

  return next();
}