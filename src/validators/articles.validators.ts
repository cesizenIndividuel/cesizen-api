import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//         Schéma article base         //
//-------------------------------------//

const zArticle = z.object({
  id: CommonSchemas.uuidSchema,
  slug: CommonSchemas.slugSchema,
  title: z.string().trim().min(3).max(150),
  content: z.string().trim().min(20),
  excerpt: z.string().trim().max(300),
  categoryIds: z.array(CommonSchemas.uuidSchema).max(10),
});


//-------------------------------------//
//          Liste d'articles           //
//-------------------------------------//

export const listArticlesQuerySchema = z.object({
  page: CommonSchemas.pageSchema,
  limit: CommonSchemas.limitSchema,
  q: CommonSchemas.searchQuerySchema,
  category: z.string().trim().min(1).optional(),
});


//-------------------------------------//
//           Slug article              //
//-------------------------------------//

export const articleSlugParamSchema = zArticle.pick({
  slug: true,
});


//-------------------------------------//
//          Création article           //
//-------------------------------------//

export const createArticleSchema = zArticle
  .pick({
    title: true,
    content: true,
    excerpt: true,
    categoryIds: true,
  })
  .extend({
    excerpt: zArticle.shape.excerpt.optional(),
    categoryIds: zArticle.shape.categoryIds.optional(),
  });


//-------------------------------------//
//             Id article              //
//-------------------------------------//

export const articleIdParamSchema = zArticle.pick({
  id: true,
});


//-------------------------------------//
//         Mise à jour article         //
//-------------------------------------//

export const updateArticleSchema = zArticle
  .pick({
    title: true,
    content: true,
    excerpt: true,
    categoryIds: true,
  })
  .partial();


//-------------------------------------//
//      Liste d'articles admin         //
//-------------------------------------//

export const listAdminArticlesQuerySchema = z.object({
  page: CommonSchemas.pageSchema,
  limit: CommonSchemas.limitSchema,
  q: CommonSchemas.searchQuerySchema,
  status: z.enum(["ALL", "DRAFT", "PUBLISHED", "DELETED"]).default("ALL"),
});


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type ListArticlesQuery = z.infer<typeof listArticlesQuerySchema>;
export type ArticleSlugParam = z.infer<typeof articleSlugParamSchema>;
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type ArticleIdParam = z.infer<typeof articleIdParamSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type ListAdminArticlesQuery = z.infer<typeof listAdminArticlesQuerySchema>;