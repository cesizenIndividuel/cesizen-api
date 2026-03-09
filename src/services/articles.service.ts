import { prisma } from "../db/prisma";
import type * as articlesValidators from "../validators/articles.validators";
import { ArticleStatus, Prisma } from "@prisma/client";
import { slugify } from "../utils/slug";

const articleInclude = {
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
  categories: true,
} satisfies Prisma.ArticleInclude;

//Recupere un liste paginée et le nombre totale d'articles
async function findPagedArticles(
  where: Prisma.ArticleWhereInput,
  page: number,
  limit: number,
  orderBy: Prisma.ArticleOrderByWithRelationInput
) {
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: articleInclude
    }),
    prisma.article.count({ where }),
  ]);

  return { items, total };
}

//Verfie les catégories
async function ensureCategoriesExist(categoryIds: string[]) {
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true },
  });

  return categories.length === categoryIds.length;
}

//Générer un slug uniquement 
async function buildUniqueArticleSlug(title: string, currentId?: string) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.article.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  return slug;
}



export const articlesService = {
  //-------------------------------------//
  //        Lister les articles          //
  //-------------------------------------//
  async listPublic(query: articlesValidators.ListArticlesQuery, userId?: string) {
    const { page, limit, q, category } = query;

    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
      ...(q ? {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } }
        ]
      } : {}),
      ...(category ? {
        categories: {
          some: { slug: category }
        }
      } : {})
    };

    const { items, total } = await findPagedArticles(where, page, limit, {
      publishedAt: "desc"
    });

    let favoriteIds = new Set<string>();

    //Si l'utilisateur est connecté
    if (userId) {

      //Récupérer ses articles favoris
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          favoriteArticles: {
            select: { id: true },
          },
        },
      });
      //Transformer les favoris en Set pour recherche rapide
      favoriteIds = new Set(
        user?.favoriteArticles.map((article) => article.id) ?? []
      );
    }

    //Ajouter la propriété isFavorite sur chaque article
    const itemsWithFavorite = items.map((article) => ({
      ...article,

      //true si l'article est dans les favoris de l'utilisateur
      isFavorite: favoriteIds.has(article.id),
    }));

    return {
      ok: true as const,
      items: itemsWithFavorite,
      total,
    };
  },

  //-------------------------------------//
  //      Détail public par slug         //
  //-------------------------------------//
  async getPublicBySlug(slug: string) {
    const article = await prisma.article.findFirst({
      where: {
        slug,
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      include: articleInclude
    });

    if (!article) return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };

    return { ok: true as const, article };
  },

  //-------------------------------------//
  //         Créer un article            //
  //-------------------------------------//
  async create(data: articlesValidators.CreateArticleInput, authorId: string) {
    const slug = await buildUniqueArticleSlug(data.title);
    
    const { categoryIds, ...articleData } = data;

    if (categoryIds) {
      const categoriesExist = await ensureCategoriesExist(categoryIds);
      if (!categoriesExist) {
        return { ok: false as const, error: "CATEGORY_NOT_FOUND" as const };
      }
    }

    const article = await prisma.article.create({
      data: {
        ...articleData,
        slug,
        authorId,
        status: ArticleStatus.DRAFT,
        ...(categoryIds && {
          categories: {
            connect: categoryIds.map(id => ({ id }))
          }
        })
      },
      include: articleInclude
    });

    return { ok: true as const, article };
  },

  //-------------------------------------//
  //         Publier un article          //
  //-------------------------------------//
  async publishById(id: string) {
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: articleInclude
    });
    return { ok: true as const, article };
  },

  //-------------------------------------//
  //       Restaurer un article          //
  //-------------------------------------//
  async restoreById(id: string) {
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    if (!existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_DELETED" as const };
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        deletedAt: null,
      },
      include: articleInclude
    });

    return { ok: true as const, article };
  },

  //-------------------------------------//
  //         Modifier un article         //
  //-------------------------------------//
  async updateById(id: string, data: articlesValidators.UpdateArticleInput) {
    const existing = await prisma.article.findUnique({ where: { id } });

    if (!existing || existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    let slug = existing.slug;
    //Changement du titre => maj du slug 
    if (data.title && data.title !== existing.title) {
      slug = await buildUniqueArticleSlug(data.title, id);
    }

    //Separation des catégories
    const { categoryIds, ...articleData } = data;

    if (categoryIds) {
      const categoriesExist = await ensureCategoriesExist(categoryIds);
      if (!categoriesExist) {
        return { ok: false as const, error: "CATEGORY_NOT_FOUND" as const };
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        slug,
        ...(categoryIds
          ? { categories: { set: categoryIds.map((categoryId) => ({ id: categoryId })) } }
          : {}),
      },
      include: articleInclude
    });

    return { ok: true as const, article };
  },

  //-------------------------------------//
  //        Supprimer un article         //
  //-------------------------------------//
  async deleteById(id: string) {
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    await prisma.article.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { ok: true as const };
  },

  //-------------------------------------//
  //     Liste admin des articles        //
  //-------------------------------------//
  async listAdmin(query: articlesValidators.ListAdminArticlesQuery) {
    const { page, limit, q, status } = query;

    //creation filtre prisma
    const where: Prisma.ArticleWhereInput = {};

    // Brouillons non supprimés
    if (status === ArticleStatus.DRAFT) {
      where.status = ArticleStatus.DRAFT;
      where.deletedAt = null;
    }

    //Publiés non supprimés
    if (status === ArticleStatus.PUBLISHED) {
      where.status = ArticleStatus.PUBLISHED;
      where.deletedAt = null;
    }

    //Suprimés
    if (status === "DELETED") {
      where.deletedAt = {
        not: null,
      };
    }

    // Recherche
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
      ];
    }

    const { items, total } = await findPagedArticles(
      where,
      page,
      limit,
      { publishedAt: "desc" }
    );

    return { ok: true as const, items, total };
  },

  //-------------------------------------//
  //      MAJ de l'image article         //
  //-------------------------------------//
  async updateImage(id: string, imageUrl: string) {
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    const article = await prisma.article.update({
      where: { id },
      data: { imageUrl },
      include: articleInclude
    });

    return {
      ok: true as const,
      article,
      previousImageUrl: existing.imageUrl,
    };
  },

};