import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { listArticlesQuerySchema } from "../validators/articles.validators";
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