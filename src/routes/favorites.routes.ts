import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as favorites from "../controllers/favorites.controller";

export const favoritesRoutes = Router();

favoritesRoutes.use(requireAuth);

favoritesRoutes.get("/", favorites.getMyFavorites);
favoritesRoutes.post("/:articleId", favorites.addFavorite);
favoritesRoutes.delete("/:articleId", favorites.removeFavorite);