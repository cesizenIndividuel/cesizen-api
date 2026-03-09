import { prisma } from "../db/prisma";
import type { SubmitDiagnosticInput } from "../validators/diagnostics.validators";

const publicQuestionSelect = {
  id: true,
  label: true,
  order: true,
  answers: {
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      label: true,
    },
  },
} as const;

const adminQuestionSelect = {
  id: true,
  label: true,
  order: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  answers: {
    orderBy: { order: "asc" },
    select: {
      id: true,
      label: true,
      weight: true,
      order: true,
      isActive: true,
    },
  },
} as const;

const diagnosticSelect = {
  id: true,
  score: true,
  level: true,
  createdAt: true,
} as const;

export const diagnosticsService = {
  //-------------------------------------//
  //      Lister les questions           //
  //-------------------------------------//
  async listQuestions() {
    const questions = await prisma.stressQuestion.findMany({
      where: {isActive: true},
      orderBy: {order: "asc"},
      select: publicQuestionSelect
    });

    return { ok: true as const, questions };
  },

  //-------------------------------------//
  //        Soumettre un diagnostic      //
  //-------------------------------------//
  async submit(userId: string, data: SubmitDiagnosticInput) {

    //----------VERIFIER QUESTIONS ENVOYEES----------//
    const activeQuestions = await prisma.stressQuestion.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const activeQuestionIds = activeQuestions.map((question) => question.id);
    const sentQuestionIds = data.answers.map((item) => item.questionId);
    const uniqueQuestionIds = new Set(sentQuestionIds);

    if (uniqueQuestionIds.size !== data.answers.length) {
      return { ok: false as const, error: "DUPLICATE_QUESTION" as const };
    }

    if (data.answers.length !== activeQuestionIds.length) {
      return { ok: false as const, error: "MISSING_ANSWERS" as const };
    }

    //----------VERIFIER LES REPONSES----------//
    const answerIds = data.answers.map((item) => item.answerId);

    const selectedAnswers = await prisma.stressAnswer.findMany({
      where: {
        id: { in: answerIds },
        isActive: true,
      },
      select: {
        id: true,
        questionId: true,
        weight: true,
      },
    });

    const answerById = new Map(selectedAnswers.map((answer) => [answer.id, answer]));

    //----------CALCUL DU SCORE ET DU NIVEAU----------//
    const score = selectedAnswers.reduce((total, answer) => total + answer.weight, 0);

    let level: "LOW" | "MEDIUM" | "HIGH";

    if (score < 150) {
      level = "LOW";
    } else if (score <= 300) {
      level = "MEDIUM";
    } else {
      level = "HIGH";
    }

    //----------CALCUL DU SCORE ET DU NIVEAU----------//
    const diagnostic = await prisma.stressDiagnostic.create({
      data: {
        userId,
        score,
        level,
        answers: {
          create: data.answers.map((item) => ({
            questionId: item.questionId,
            answerId: item.answerId,
          })),
        },
      },
      select: diagnosticSelect
    });

    return { ok: true as const, diagnostic };
  },

  //-------------------------------------//
  //      Historique des diagnostics     //
  //-------------------------------------//
  async findMyDiagnostics(userId: string) {
    const diagnostics = await prisma.stressDiagnostic.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: diagnosticSelect
    });

    return diagnostics;
  },

  //-------------------------------------//
  //   Admin - Liste des questions       //
  //-------------------------------------//
  async findAllQuestionsForAdmin() {
    const questions = await prisma.stressQuestion.findMany({
      orderBy: {
        order: "asc",
      },
      select: adminQuestionSelect
    });

    return questions;
  },

  //-------------------------------------//
  //   Admin - Modifier une question     //
  //-------------------------------------//
  async updateQuestionById(id: string, data: { label?: string; order?: number }) {
    const existing = await prisma.stressQuestion.findUnique({
      where: { id },
    });

    if (!existing) {
      return { ok: false as const, error: "QUESTION_NOT_FOUND" as const };
    }

    if (data.order !== undefined && data.order !== existing.order) {
      const orderUsed = await prisma.stressQuestion.findFirst({
        where: {
          order: data.order,
          NOT: { id },
        },
      });

      if (orderUsed) {
        return { ok: false as const, error: "QUESTION_ORDER_ALREADY_USED" as const };
      }
    }

    const question = await prisma.stressQuestion.update({
      where: { id },
      data: {
        ...data,
      },
      select: {
        id: true,
        label: true,
        order: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return { ok: true as const, question };
  },

  //-------------------------------------//
  //    Admin - Modifier une réponse     //
  //-------------------------------------//
  async updateAnswerById(
    id: string,
    data: { label?: string; weight?: number; order?: number }
  ) {
    const existing = await prisma.stressAnswer.findUnique({
      where: { id },
      select: {
        id: true,
        questionId: true,
        order: true,
      },
    });

    if (!existing) {
      return { ok: false as const, error: "ANSWER_NOT_FOUND" as const };
    }

    if (data.order !== undefined && data.order !== existing.order) {
      const orderUsed = await prisma.stressAnswer.findFirst({
        where: {
          questionId: existing.questionId,
          order: data.order,
          NOT: { id },
        },
      });

      if (orderUsed) {
        return { ok: false as const, error: "ANSWER_ORDER_ALREADY_USED" as const };
      }
    }

    const answer = await prisma.stressAnswer.update({
      where: { id },
      data: {
        ...data,
      },
      select: {
        id: true,
        label: true,
        weight: true,
        order: true,
        isActive: true,
        questionId: true,
      },
    });

    return { ok: true as const, answer };
  },


};