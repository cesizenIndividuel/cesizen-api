import { prisma } from "../db/prisma";
import { ArticleStatus } from "@prisma/client";

export const dashboardService = {
  async getAdminDashboard() {
    const [
      usersCount,
      articlesCount,
      diagnosticsCount,
      commentsCount,
      recentArticles,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.stressDiagnostic.count(),
      prisma.comment.count(),
      prisma.article.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        select: {
          id: true,
          title: true,
          createdAt: true,
          status: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
              pseudo: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          pseudo: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      stats: {
        usersCount,
        articlesCount,
        diagnosticsCount,
        commentsCount,
      },
      recentArticles,
      recentUsers,
    };
  },
};
