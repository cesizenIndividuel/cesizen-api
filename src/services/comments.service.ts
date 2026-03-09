import { prisma } from "../db/prisma";
import { ArticleStatus } from "@prisma/client";
import type { CreateCommentInput } from "../validators/comments.validators";

const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      pseudo: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      role: true,
    },
  },
} as const;

export const commentsService = {
  //-------------------------------------//
  //        Créer un commentaire         //
  //-------------------------------------//
  async create(articleId: string, userId: string, data: CreateCommentInput) {
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!article) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        articleId,
        userId,
      },
      select: commentSelect,
    });

    return { ok: true as const, comment };
  },
};