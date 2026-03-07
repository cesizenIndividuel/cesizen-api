import { prisma } from "../db/prisma";
import type * as articlesValidators from "../validators/articles.validators";
import { ArticleStatus, Prisma } from "@prisma/client";

const publicAuthorSelect = {
  id: true,
  pseudo: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
  role: true,
} satisfies Prisma.UserSelect; //verifie la validité du select

function slugify(value: string): string {
  return value
    .normalize("NFD")                 // é => e + accent
    .replace(/[\u0300-\u036f]/g, "")  // é => e
    .toLowerCase()                    // HelLo => hello
    .trim()                           // Supprime les espaces
    .replace(/[^a-z0-9\s-]/g, "")     // Supprime caractères spéciaux 
    .replace(/\s+/g, "-")             // " " => -
    .replace(/-+/g, "-");             // "    " => -
}

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
      include: {
        author: {
          select: publicAuthorSelect,
        },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { items, total };
}

export const articlesService = {
  //-------------------------------------//
  //        Lister les articles          //
  //-------------------------------------//
  async listPublic(query: articlesValidators.ListArticlesQuery) {
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
    const { items, total } = await findPagedArticles(
      where,
      page,
      limit,
      { publishedAt: "desc" }
    );

    return { ok: true as const, items, total };
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
      include: {
        author: {
          select: publicAuthorSelect
        },
      },
    });

    if (!article) return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };

    return { ok: true as const, article };
  },

  //-------------------------------------//
  //         Créer un article            //
  //-------------------------------------//
  async create(data: articlesValidators.CreateArticleInput, authorId: string) {
    const baseSlug = slugify(data.title); 

    let slug = baseSlug;
    let suffix = 2;

    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        authorId,
        status: ArticleStatus.DRAFT
      }
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
      include: {
        author: {
          select: publicAuthorSelect
        },
      },
    });
    return { ok: true as const, article };
  },

  //-------------------------------------//
  //         Modifier un article         //
  //-------------------------------------//
  async updateById(id: string, data: articlesValidators.UpdateArticleInput) {
    const existing = await prisma.article.findUnique({
      where: { id },
    });

    if (!existing || existing.deletedAt) {
      return { ok: false as const, error: "ARTICLE_NOT_FOUND" as const };
    }

    let slug = existing.slug;

    if (data.title && data.title !== existing.title) {
      const baseSlug = slugify(data.title);
      slug = baseSlug;
      let suffix = 2;

      while (await prisma.article.findFirst({where: {slug, NOT: { id }}})) {
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        slug,
      },
      include: {
        author: {
          select: publicAuthorSelect
        },
      },
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
};