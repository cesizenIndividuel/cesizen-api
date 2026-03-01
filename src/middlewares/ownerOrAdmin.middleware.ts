import { Request, Response, NextFunction } from "express";

export function ownerOrAdmin(paramName: string = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth as { userId: string; role: "USER" | "ADMIN" } | undefined;

    if (!auth) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
    }

    // Admin : peut tout faire
    if (auth.role === "ADMIN") return next();

    // User : seulement son propre compte
    const targetId = req.params[paramName];
    if (auth.userId === targetId) return next();

    return res.status(403).json({ error: "FORBIDDEN", message: "Only owner or admin" });
  };
}