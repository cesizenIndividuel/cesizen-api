import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import type { RegisterInput, LoginInput } from "../validators/auth.validators";
import * as jwtUtils from "../utils/jwt";

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
  //-------------------------------------//
  //             S'inscrire              //
  //-------------------------------------//
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
  },

  //-------------------------------------//
  //            Se connecter             //
  //-------------------------------------//

  async login(data: LoginInput) {
    // Trouver le user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, password: true, role: true, isActive: true }
    });

    if (!user) return { ok: false as const, error: "INVALID_CREDENTIALS" as const };

    if (!user.isActive) return { ok: false as const, error: "ACCOUNT_INACTIVE" as const };

    // Vérifier le mot de passe
    const okPassword = await bcrypt.compare(data.password, user.password);
    if (!okPassword) {
      return { ok: false as const, error: "INVALID_CREDENTIALS" as const };
    }

    // access token
    const accessToken = jwtUtils.signAccessToken({ userId: user.id, role: user.role });

    // refresh token + stockage hash en BDD
    const refreshToken = jwtUtils.generateRefreshToken();
    const tokenHash = jwtUtils.hashRefreshToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: jwtUtils.getRefreshExpiresAt(),
      },
    });

    const { password, ...safeUser } = user;

    return { ok: true as const, user: safeUser, accessToken, refreshToken };
  },
  //-------------------------------------//
  //           Se déconnecter            //
  //-------------------------------------//
  async logout(refreshToken: string | undefined) {
    if (!refreshToken) {
      return { ok: true as const };
    }

    const tokenHash = jwtUtils.hashRefreshToken(refreshToken);
    //On trouve le token hash dans la BDD et on met un revokedAt
    await prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { ok: true as const };
  },


};
