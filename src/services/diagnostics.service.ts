import { prisma } from "../db/prisma";

export const diagnosticsService = {
  //-------------------------------------//
  //      Lister les questions           //
  //-------------------------------------//
  async listQuestions() {
    const questions = await prisma.stressQuestion.findMany({
      where: {isActive: true},
      orderBy: {order: "asc"},
      select: {
        id: true,
        label: true,
        order: true,
        answers: {
          where: {isActive: true},
          orderBy: {order: "asc"},
          select: {id: true, label: true},
        },
      },
    });

    return { ok: true as const, questions };
  },
};