import { Router } from "express";
import * as articlesController from "../controllers/articles.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const articlesRoutes = Router();

articlesRoutes.get("/", articlesController.listPublicArticles);
articlesRoutes.get("/:slug", articlesController.getPublicArticle);
articlesRoutes.post("/", requireAuth, requireRole("ADMIN"), articlesController.createArticle);