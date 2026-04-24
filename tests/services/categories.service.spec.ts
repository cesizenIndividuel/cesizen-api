import { describe, it, expect, vi, beforeEach } from "vitest";
import { categoriesService } from "../../src/services/categories.service";
import { prisma } from "../../src/db/prisma";
import { slugify } from "../../src/utils/slug";

// ---------------------------------------------------//
//               MOCK DU CLIENT PRISMA                //
// ---------------------------------------------------//
vi.mock("../../src/db/prisma", () => ({
  prisma: {
    category: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// ---------------------------------------------------//
//                 MOCK DU SLUGIFY                    //
// ---------------------------------------------------//
vi.mock("../../src/utils/slug", () => ({
  slugify: vi.fn(),
}));


describe("categoriesService", () => {
  beforeEach(() => {
    // vide l'historique des mocks
    vi.clearAllMocks();
  });

  // Objet de base réutilisable dans plusieurs tests
  const fakeCategory = {
    id: "1",
    name: "Stress",
    slug: "stress",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  //Test : creation d'une catégorie
  describe("create", () => {
    it("crée une catégorie si le nom n'existe pas", async () => {
      vi.mocked(prisma.category.findUnique)
        .mockResolvedValueOnce(null) // aucun nom identique trouvé
        .mockResolvedValueOnce(null); // aucun slug identique trouvé

      vi.mocked(slugify).mockReturnValue("stress");
      vi.mocked(prisma.category.create).mockResolvedValue(fakeCategory);

      const result = await categoriesService.create({ name: "Stress" });

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { name: "Stress" },
      });

      expect(slugify).toHaveBeenCalledWith("Stress");

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: "Stress",
          slug: "stress",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: fakeCategory,
      });
    });

    // Ce test vérifie que le service refuse la création si une catégorie avec le même nom existe déjà.
    it("retourne une erreur si le nom existe déjà", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);

      const result = await categoriesService.create({ name: "Stress" });

      expect(result).toEqual({
        ok: false,
        error: "CATEGORY_NAME_ALREADY_USED",
      });

      expect(prisma.category.create).not.toHaveBeenCalled();
    });

    // Ce test vérifie que si le slug existe déjà, le service ajoute bien un suffixe numérique.
    it("ajoute un suffixe au slug si le slug existe déjà", async () => {
      const createdCategory = {
        id: "2",
        name: "Stress",
        slug: "stress-2",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.category.findUnique)
        .mockResolvedValueOnce(null) // nom libre
        .mockResolvedValueOnce(fakeCategory) // slug "stress" déjà pris
        .mockResolvedValueOnce(null); // slug "stress-2" libre

      vi.mocked(slugify).mockReturnValue("stress");
      vi.mocked(prisma.category.create).mockResolvedValue(createdCategory);

      const result = await categoriesService.create({ name: "Stress" });

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: "Stress",
          slug: "stress-2",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: createdCategory,
      });
    });
  });

  describe("findAll", () => {
    // Ce test vérifie que le service retourne bien toutes les catégories triées par ordre alphabétique.
    it("retourne les catégories triées par nom", async () => {
      const fakeCategories = [
        {
          id: "2",
          name: "Anxiété",
          slug: "anxiete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "1",
          name: "Stress",
          slug: "stress",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.category.findMany).mockResolvedValue(fakeCategories);

      const result = await categoriesService.findAll();

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });

      expect(result).toEqual(fakeCategories);
    });
  });

  describe("updateById", () => {
    // Ce test vérifie que le service retourne une erreur si on essaie de modifier une catégorie qui n'existe pas.
    it("retourne une erreur si la catégorie n'existe pas", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);

      const result = await categoriesService.updateById("123", {
        name: "Bien-être",
      });

      expect(result).toEqual({
        ok: false,
        error: "CATEGORY_NOT_FOUND",
      });

      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    // Ce test vérifie que le service refuse la modification si le nouveau nom est déjà utilisé par une autre catégorie.
    it("retourne une erreur si le nouveau nom est déjà utilisé", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);

      vi.mocked(prisma.category.findFirst).mockResolvedValue({
        id: "2",
        name: "Bien-être",
        slug: "bien-etre",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await categoriesService.updateById("1", {
        name: "Bien-être",
      });

      expect(result).toEqual({
        ok: false,
        error: "CATEGORY_NAME_ALREADY_USED",
      });

      expect(prisma.category.update).not.toHaveBeenCalled();
    });

    // Ce test vérifie que si le nom ne change pas, le slug actuel est conservé lors de la mise à jour.
    it("met à jour la catégorie sans changer le slug si le nom ne change pas", async () => {
      const updatedCategory = {
        ...fakeCategory,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoriesService.updateById("1", {
        name: "Stress",
      });

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Stress",
          slug: "stress",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: updatedCategory,
      });
    });

    // Ce test vérifie que si le nom change, un nouveau slug est bien généré.
    it("met à jour la catégorie et régénère le slug si le nom change", async () => {
      const updatedCategory = {
        id: "1",
        name: "Gestion du stress",
        slug: "gestion-du-stress",
        createdAt: fakeCategory.createdAt,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);

      vi.mocked(prisma.category.findFirst)
        .mockResolvedValueOnce(null) // le nouveau nom n'est pas déjà utilisé
        .mockResolvedValueOnce(null); // le nouveau slug est disponible

      vi.mocked(slugify).mockReturnValue("gestion-du-stress");
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoriesService.updateById("1", {
        name: "Gestion du stress",
      });

      expect(slugify).toHaveBeenCalledWith("Gestion du stress");

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Gestion du stress",
          slug: "gestion-du-stress",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: updatedCategory,
      });
    });

    // Ce test vérifie que si le nouveau slug existe déjà, le service ajoute un suffixe numérique pendant la mise à jour.
    it("ajoute un suffixe au slug si le slug existe déjà pendant la mise à jour", async () => {
      const updatedCategory = {
        id: "1",
        name: "Gestion du stress",
        slug: "gestion-du-stress-2",
        createdAt: fakeCategory.createdAt,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);

      vi.mocked(prisma.category.findFirst)
        .mockResolvedValueOnce(null) // nom libre
        .mockResolvedValueOnce({
          id: "99",
          name: "Autre catégorie",
          slug: "gestion-du-stress",
          createdAt: new Date(),
          updatedAt: new Date(),
        }) // slug déjà pris
        .mockResolvedValueOnce(null); // slug avec suffixe libre

      vi.mocked(slugify).mockReturnValue("gestion-du-stress");
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoriesService.updateById("1", {
        name: "Gestion du stress",
      });

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Gestion du stress",
          slug: "gestion-du-stress-2",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: updatedCategory,
      });
    });

    // Ce test vérifie que le service peut aussi mettre à jour une catégorie avec un body vide, donc sans changer le nom.
    // Dans ce cas, il conserve les valeurs existantes, notamment le slug.
    it("met à jour la catégorie même si aucun champ n'est fourni", async () => {
      const updatedCategory = {
        ...fakeCategory,
        updatedAt: new Date(),
      };

      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);
      vi.mocked(prisma.category.update).mockResolvedValue(updatedCategory);

      const result = await categoriesService.updateById("1", {});

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          slug: "stress",
        },
      });

      expect(result).toEqual({
        ok: true,
        category: updatedCategory,
      });
    });
  });

  describe("deleteById", () => {
    // Ce test vérifie que le service retourne une erreur, si on essaie de supprimer une catégorie inexistante.
    it("retourne une erreur si la catégorie n'existe pas", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null);

      const result = await categoriesService.deleteById("123");

      expect(result).toEqual({
        ok: false,
        error: "CATEGORY_NOT_FOUND",
      });

      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    // Ce test vérifie que la catégorie est bien supprimé, lorsqu'elle existe dans la base.
    it("supprime la catégorie si elle existe", async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(fakeCategory);
      vi.mocked(prisma.category.delete).mockResolvedValue(fakeCategory);

      const result = await categoriesService.deleteById("123");

      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: "123" },
      });

      expect(result).toEqual({
        ok: true,
      });
    });
  });
});