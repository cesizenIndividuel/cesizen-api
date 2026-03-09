import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { favoritesService } from "../services/favorites.service";
import * as favoritesValidators from "../validators/favorites.validators";

//-------------------------------------//
//     Ajouter un article favori       //
//-------------------------------------//
export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const params = parseOr400(favoritesValidators.favoriteArticleIdParamSchema, req.params, res);
  if (!params) return;

  const result = await favoritesService.add(userId, params.articleId);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(201).json(result.favorite);
});

//-------------------------------------//
//    Retirer un article favori        //
//-------------------------------------//
export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const params = parseOr400(favoritesValidators.favoriteArticleIdParamSchema, req.params, res);
  if (!params) return;

  await favoritesService.remove(userId, params.articleId);

  return res.status(204).send();
});