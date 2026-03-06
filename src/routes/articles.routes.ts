import { Router } from "express";
import * as articlesController from "../controllers/articles.controller";

export const articlesRoutes = Router();

articlesRoutes.get("/", articlesController.listPublicArticles);
articlesRoutes.get("/:slug", articlesController.getPublicArticle);