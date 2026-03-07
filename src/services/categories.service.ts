import { prisma } from "../db/prisma";
import type * as categoriesValidators from "../validators/categories.validators";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const categoriesService = {
  //-------------------------------------//
  //        Créer une catégorie          //
  //-------------------------------------//
  async create(data: categoriesValidators.CreateCategoryInput) {
    const existingName = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      return { ok: false as const, error: "CATEGORY_NAME_ALREADY_USED" as const };
    }

    const baseSlug = slugify(data.name);

    let slug = baseSlug;
    let suffix = 2;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
      },
    });

    return { ok: true as const, category };
  },

  //-------------------------------------//
  //       Lister les catégories         //
  //-------------------------------------//
  async findAll() {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    return categories;
  },



};