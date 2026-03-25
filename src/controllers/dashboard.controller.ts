import { Request, Response } from "express";
import { asyncHandler } from "../utils/http";
import { dashboardService } from "../services/dashboard.service";

export const getAdminDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const dashboard = await dashboardService.getAdminDashboard();
    return res.status(200).json(dashboard);
  }
);
