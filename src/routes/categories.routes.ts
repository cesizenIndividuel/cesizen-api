import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const categoriesRoutes = Router();

categoriesRoutes.post("/", requireAuth, requireRole("ADMIN"), categoriesController.createCategory);