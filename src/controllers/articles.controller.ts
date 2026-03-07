import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import * as articlesValidators from "../validators/articles.validators";import { articlesService } from "../services/articles.service";

//----------------------------------//
//         Liste publique           //
//----------------------------------//
export const listPublicArticles = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOr400(articlesValidators.listArticlesQuerySchema, req.query, res);
  if (!query) return;

  const result = await articlesService.listPublic(query);

  return res.status(200).json({
    items: result.items,
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
});

//----------------------------------//
//     Détail public par slug       //
//----------------------------------//
export const getPublicArticle = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(articlesValidators.articleSlugParamSchema, req.params, res);
  if (!params) return;

  const result = await articlesService.getPublicBySlug(params.slug);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.article);
});

//----------------------------------//
//        Création article          //
//----------------------------------//
export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(articlesValidators.createArticleSchema, req.body, res);
  if (!body) return;

  const auth = req.auth as { userId: string; role: "USER" | "ADMIN" };

  const result = await articlesService.create(body, auth.userId);

  return res.status(201).json(result.article);
});

//----------------------------------//
//        Publier article           //
//----------------------------------//
export const publishArticle = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(articlesValidators.articleIdParamSchema, req.params, res);
  if (!params) return;

  const result = await articlesService.publishById(params.id);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.article);
});

//----------------------------------//
//        Modifier article          //
//----------------------------------//
export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(articlesValidators.articleIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(articlesValidators.updateArticleSchema, req.body, res);
  if (!body) return;

  const result = await articlesService.updateById(params.id, body);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.article);
});

//----------------------------------//
//       Supprimer article          //
//----------------------------------//
export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(articlesValidators.articleIdParamSchema, req.params, res);
  if (!params) return;

  const result = await articlesService.deleteById(params.id);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});

//----------------------------------//
//       Liste admin articles       //
//----------------------------------//
export const listAdminArticles = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOr400(articlesValidators.listAdminArticlesQuerySchema, req.query, res);
  if (!query) return;

  const result = await articlesService.listAdmin(query);

  return res.status(200).json({
    items: result.items,
    page: query.page,
    limit: query.limit,
    total: result.total,
  });
});