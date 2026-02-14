import { Request, Response } from "express";
import { healthService } from "../services/health.service";

export function getHealth(req: Request, res: Response) {
  const result = healthService.check();
  return res.status(200).json(result);
}
