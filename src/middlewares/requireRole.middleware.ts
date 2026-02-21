import { Request, Response, NextFunction } from "express";

export function requireRole(...allowedRoles: Array<"USER" | "ADMIN">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as any).auth as { userId: string; role: "USER" | "ADMIN" } | undefined;

    if (!auth) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
    }

    if (!allowedRoles.includes(auth.role)) {
      return res.status(403).json({ error: "FORBIDDEN", message: "Insufficient permissions" });
    }

    return next();
  };
}