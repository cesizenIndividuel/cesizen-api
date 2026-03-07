import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

//Liste d'article
export const listArticlesQuerySchema = z.object({
  page: CommonSchemas.pageSchema,
  limit: CommonSchemas.limitSchema,
  q: CommonSchemas.searchQuerySchema,
});

//slug article
export const articleSlugParamSchema = z.object({
  slug: CommonSchemas.slugSchema,
});

//Création article
export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(150),
  content: z.string().trim().min(20),
  excerpt: z.string().trim().max(300).optional(),
});

//id article
export const articleIdParamSchema = z.object({
  id: CommonSchemas.uuidSchema,
});

export const updateArticleSchema = createArticleSchema.partial();


export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
export type ArticleSlugParam = z.infer<typeof articleSlugParamSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type ArticleIdParam = z.infer<typeof articleIdParamSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;



