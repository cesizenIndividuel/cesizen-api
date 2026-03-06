import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { listArticlesQuerySchema, articleSlugParamSchema } from "../validators/articles.validators";
import { articlesService } from "../services/articles.service";

//----------------------------------//
//         Liste publique           //
//----------------------------------//
export const listPublicArticles = asyncHandler(async (req: Request, res: Response) => {
  const query = parseOr400(listArticlesQuerySchema, req.query, res);
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
  const params = parseOr400(articleSlugParamSchema, req.params, res);
  if (!params) return;

  const result = await articlesService.getPublicBySlug(params.slug);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.article);
});