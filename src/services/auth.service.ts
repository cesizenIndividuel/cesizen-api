import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import type { RegisterInput } from "../validators/auth.validators";

const userSelect = {
  id: true,
  email: true,
  pseudo: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  avatarUrl: true,
  createdAt: true
} as const;

export const authService = {
  async register(data: RegisterInput) {
    // 1) email unique
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) return { ok: false as const, error: "EMAIL_ALREADY_USED" as const };

    // 2) pseudo unique
    const existingPseudo = await prisma.user.findUnique({ where: { pseudo: data.pseudo } });
    if (existingPseudo) return { ok: false as const, error: "PSEUDO_ALREADY_USED" as const };

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        pseudo: data.pseudo,
        password: passwordHash,
        cguAcceptedAt: new Date(),
        role: "USER",
        isActive: true
      },
      select: userSelect
    });

    return { ok: true as const, user };
  }
};
