import { prisma } from "../db/prisma";
import { ArticleStatus } from "@prisma/client";

const favoriteArticleSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  imageUrl: true,
  publishedAt: true,
} as const;

export const favoritesService = {
  //-------------------------------------//
  //     Ajouter un article favori       //
  //-------------------------------------//
  async add(userId: string, articleId: string) {
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!article) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArticles: {
          connect: { id: articleId },
        },
      },
    });

    const favorite = await prisma.article.findUnique({
      where: { id: articleId },
      select: favoriteArticleSelect,
    });

    return { ok: true as const, favorite };
  },

  //-------------------------------------//
  //    Retirer un article favori        //
  //-------------------------------------//
  async remove(userId: string, articleId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        favoriteArticles: {
          disconnect: { id: articleId },
        },
      },
    });

    return { ok: true as const };
  },

  //-------------------------------------//
  //        Lister mes favoris           //
  //-------------------------------------//
  async findMine(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        favoriteArticles: {
          where: {
            status: ArticleStatus.PUBLISHED,
            deletedAt: null,
          },
          orderBy: { publishedAt: "desc" },
          select: favoriteArticleSelect,
        },
      },
    });

    return user?.favoriteArticles ?? [];
  },
};