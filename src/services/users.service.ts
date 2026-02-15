import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import type { CreateUserInput } from "../validators/users.validators";

export const usersService = {

  //#region Creation user
  async create(data: CreateUserInput) {
    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { ok: false as const, error: "EMAIL_ALREADY_USED" as const };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Créer l'user en bdd
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash
      },
      // On en renvoie pas le mdp
      select: { id: true, email: true, createdAt: true }
    });

    return { ok: true as const, user };
  },
  //#endregion

  //#region Liste d'user
  async findAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    return users;
  }
  //#endregion




};
