import { Router } from "express";
import * as articlesController from "../controllers/articles.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const articlesRoutes = Router();

articlesRoutes.get("/", articlesController.listPublicArticles);
articlesRoutes.get("/admin", requireAuth, requireRole("ADMIN"), articlesController.listAdminArticles
);
articlesRoutes.post("/", requireAuth, requireRole("ADMIN"), articlesController.createArticle);
articlesRoutes.patch("/:id/publish", requireAuth, requireRole("ADMIN"), articlesController.publishArticle);
articlesRoutes.patch("/:id", requireAuth, requireRole("ADMIN"), articlesController.updateArticle);
articlesRoutes.delete("/:id", requireAuth, requireRole("ADMIN"), articlesController.deleteArticle);
articlesRoutes.get("/slug/:slug", articlesController.getPublicArticle);
