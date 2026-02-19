import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType } from "zod";

// Wrapper pour éviter de répéter try/catch 
// fonction qui enveloppe les controllers async pour gérer automatiquement les erreurs
export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Valider les données avec Zod et 
// - si invalide : 400
// - si valide : données
export function parseOr400<T>(
    schema: ZodType<T>,
    data: unknown,
    res: Response
): T | null {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
        res.status(400).json({
            error: "VALIDATION_ERROR",
            details: parsed.error.issues
        });
        return null;
    }
  return parsed.data;
}
