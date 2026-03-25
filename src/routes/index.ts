import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { usersRoutes } from "./users.routes";
import { authRoutes } from "./auth.routes";
import { articlesRoutes } from "./articles.routes";
import { categoriesRoutes } from "./categories.routes";
import { diagnosticsRoutes } from "./diagnostics.routes";
import { favoritesRoutes } from "./favorites.routes";
import { commentsRoutes } from "./comments.routes";
import { getAdminDashboard } from "../controllers/dashboard.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const router = Router();

router.use("/health", healthRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/articles", articlesRoutes);
router.use("/categories", categoriesRoutes);
router.use("/diagnostics", diagnosticsRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/comments", commentsRoutes);

router.get("/admin/dashboard", requireAuth, requireRole("ADMIN"), getAdminDashboard);   