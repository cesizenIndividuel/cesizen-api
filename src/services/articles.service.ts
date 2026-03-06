import { prisma } from "../db/prisma";
import type { ListArticlesQuery } from "../validators/articles.validators";
import { ArticleStatus, Prisma } from "@prisma/client";

export const articlesService = {
  //-------------------------------------//
  //        Lister les articles          //
  //-------------------------------------//
  async listPublic(query: ListArticlesQuery) {
    const { page, limit, q } = query;

    //Filtre : articles publiés sans deleteAt, avec recherche
    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } }, 
              { content: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    //Recuperer les articles de la page + nbr totale des articles
    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              pseudo: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              role: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return { ok: true as const, items, total };
  },

  //-------------------------------------//
  //      Détail public par slug         //
  //-------------------------------------//
  async getPublicBySlug(slug: string) {
    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            pseudo: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    if (!article) return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };

    return { ok: true as const, article };
  },

};