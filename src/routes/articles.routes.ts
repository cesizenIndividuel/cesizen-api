import { Router } from "express";
import * as articlesController from "../controllers/articles.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import { uploadArticleImage } from "../middlewares/upload.middleware";
import { multerErrorHandler } from "../middlewares/multerError.middleware";

export const articlesRoutes = Router();

articlesRoutes.get("/", optionalAuth, articlesController.listPublicArticles);
articlesRoutes.get("/admin", requireAuth, requireRole("ADMIN"), articlesController.listAdminArticles
);
articlesRoutes.post("/", requireAuth, requireRole("ADMIN"), articlesController.createArticle);
articlesRoutes.post("/:id/image", requireAuth, requireRole("ADMIN"), uploadArticleImage, multerErrorHandler,  articlesController.updateArticleImage);
articlesRoutes.patch("/:id/publish", requireAuth, requireRole("ADMIN"), articlesController.publishArticle);
articlesRoutes.patch("/:id/restore", requireAuth, requireRole("ADMIN"),  articlesController.restoreArticle);
articlesRoutes.patch("/:id", requireAuth, requireRole("ADMIN"), articlesController.updateArticle);
articlesRoutes.delete("/:id", requireAuth, requireRole("ADMIN"), articlesController.deleteArticle);
articlesRoutes.get("/slug/:slug", articlesController.getPublicArticle);
