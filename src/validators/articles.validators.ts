import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

//Liste d'article
export const listArticlesQuerySchema = z.object({
  page: CommonSchemas.pageSchema,
  limit: CommonSchemas.limitSchema,
  q: CommonSchemas.searchQuerySchema,
});

//Détail article
export const articleSlugParamSchema = CommonSchemas.slugParamSchema;



export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
export type ArticleSlugParam = z.infer<typeof articleSlugParamSchema>;
