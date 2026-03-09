import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as favorites from "../controllers/favorites.controller";

export const favoritesRoutes = Router();

favoritesRoutes.use(requireAuth);

favoritesRoutes.post("/:articleId", favorites.addFavorite);