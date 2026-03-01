import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const listArticlesQuerySchema = z.object({
  page: CommonSchemas.pageSchema,
  limit: CommonSchemas.limitSchema,
  q: CommonSchemas.searchQuerySchema,
});

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;