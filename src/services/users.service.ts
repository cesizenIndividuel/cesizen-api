import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import type { CreateUserInput, UpdateUserInput, UpdatePasswordInput } from "../validators/users.validators";


export const usersService = {

  //----------------------------------//
  //          Creer un user           //
  //----------------------------------//
  async create(data: CreateUserInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { ok: false as const, error: "EMAIL_ALREADY_USED" as const };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return { ok: true as const, user };
  },

  //-----------------------------------//
  //          Liste des user           //
  //-----------------------------------//
  async findAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return users;
  },

  //-----------------------------------//
  //          Détail d'un user         //
  //-----------------------------------//
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    return user;
  },

  //------------------------------------//
  //          Supprimer un user         //
  //------------------------------------//
  async deleteById(id: string) {
    // On vérifie d'abord l'existence pour renvoyer 404 proprement
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false as const };
    }
    await prisma.user.delete({ where: { id } });
    return { ok: true as const };
  },

  //------------------------------------//
  //            MAJ d'un user           //
  //------------------------------------//
  async updateById(id: string, data: UpdateUserInput) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false as const, error: "USER_NOT_FOUND" as const };
    }

    // Si changement email => doit etre unique
    if (data.email && data.email !== existing.email) {
      const emailUsed = await prisma.user.findUnique({ where: { email: data.email } });
      if (emailUsed) {
        return { ok: false as const, error: "EMAIL_ALREADY_USED" as const };
      }
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { ...data },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    return { ok: true as const, user };
  },

  //------------------------------------//
  //             MAJ du mdp             //
  //------------------------------------//
  async updatePassword(id: string, data: UpdatePasswordInput) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false as const, error: "USER_NOT_FOUND" as const };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { id },
      data: { password: passwordHash }
    });

    return { ok: true as const };
  },
};
