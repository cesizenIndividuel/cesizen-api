// traduit les erreurs
import { Request, Response, NextFunction } from "express";
import multer from "multer";

export function multerErrorHandler(err: any, _req: Request, res: Response, next: NextFunction) {
  if (!err) return next();

  // erreur taille fichier
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "FILE_TOO_LARGE", maxSizeMb: 2 });
    }
    return res.status(400).json({ error: "UPLOAD_ERROR", code: err.code });
  }

  // erreur type fichier
  if (err.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({ error: "INVALID_FILE_TYPE", allowed: ["jpeg", "png", "webp"] });
  }

  // autre
  return res.status(500).json({ error: "UPLOAD_ERROR" });
}