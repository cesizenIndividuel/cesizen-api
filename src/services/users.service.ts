import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import type { CreateUserInput, UpdateUserInput, ChangeMyPasswordInput } from "../validators/users.validators";

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true,
  pseudo: true
} as const;


export const usersService = {

  //----------------------------------//
  //          Creer un user           //
  //----------------------------------//
  async create(data: CreateUserInput) {
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      return { ok: false as const, error: "EMAIL_ALREADY_USED" as const };
    }
    const existingPseudo = await prisma.user.findUnique({ where: { pseudo: data.pseudo } });
    if (existingPseudo) {
      return { ok: false as const, error: "PSEUDO_ALREADY_USED" as const };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        pseudo: data.pseudo,
        password: passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? "USER", 
        isActive: data.isActive ?? true, 
      },
      select: userSelect
    });

    return { ok: true as const, user };
  },

  //-----------------------------------//
  //          Liste des user           //
  //-----------------------------------//
  async findAll() {
    const users = await prisma.user.findMany({
      select: userSelect
    });
    return users;
  },

  //-----------------------------------//
  //          Détail d'un user         //
  //-----------------------------------//
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect
    });
    return user;
  },

  //------------------------------------//
  //          Supprimer un user         //
  //------------------------------------//
  async deleteById(id: string) {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return { ok: false as const };
    }

    await prisma.user.delete({ where: { id } });

    return { 
      ok: true as const,
      avatarUrl: existing.avatarUrl 
    };
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
      select: userSelect
    });

    return { ok: true as const, user };
  },

  //------------------------------------//
  //             MAJ du mdp             //
  //------------------------------------//
  async changeMyPassword(userId: string, data: ChangeMyPasswordInput) {
    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!existing) {
      return { ok: false as const, error: "USER_NOT_FOUND" as const };
    }

    const okOld = await bcrypt.compare(data.oldPassword, existing.password);
    if (!okOld) {
      return { ok: false as const, error: "INVALID_OLD_PASSWORD" as const };
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    return { ok: true as const };
  },

  //------------------------------------//
  //         MAJ de la photo            //
  //------------------------------------//
  async updateAvatar(id: string, avatarUrl: string) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return { ok: false as const, error: "USER_NOT_FOUND" as const };

    const user = await prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatarUrl: true,
        createdAt: true
      }
    });

    return { ok: true as const, user, previousAvatarUrl: existing.avatarUrl };
  },

};
