import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  sub: string;
  role: "USER" | "ADMIN";
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // On attache l'utilisateur au request
    (req as any).user = {
      id: decoded.sub,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "FORBIDDEN" });
  }

  next();
}