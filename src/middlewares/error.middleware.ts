import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// Middleware global de gestion des erreurs : intercepte les erreurs Prisma et serveur afin de renvoyer des réponses HTTP cohérentes (503, 400, 500) sans faire planter l’API.

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  // Base down : 503
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(503).json({
      error: "DATABASE_UNAVAILABLE",
      message: "La base de données est indisponible. Vérifie Docker/Postgres."
    });
  }

  // 400 : Erreur prisma connue
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Codes courants quand la DB est down / injoignable
    const dbDownCodes = new Set(["P1000", "P1001", "P1002", "P1017"]);

    if (dbDownCodes.has(err.code)) {
      return res.status(503).json({
        error: "DATABASE_UNAVAILABLE",
        code: err.code,
        message: "La base de données est indisponible. Vérifie Docker/Postgres."
      });
    }

    return res.status(400).json({
      error: "DATABASE_ERROR",
      code: err.code
    });
  }
  
  if (err && typeof err === "object" && "type" in err && (err as any).type === "entity.parse.failed") {
    return res.status(400).json({
      error: "INVALID_JSON",
      message: "JSON invalide (virgule en trop ? guillemets manquants ?)"
    });
  }

  // 500 : erreur inconnue
  console.error(err);
  return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
}
