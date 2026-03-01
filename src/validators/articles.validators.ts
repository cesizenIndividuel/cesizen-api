import { z } from "zod";

export const listArticlesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  q: z.string().trim().min(1).optional(),
});

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;