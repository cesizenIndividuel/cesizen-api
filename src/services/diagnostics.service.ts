import { prisma } from "../db/prisma";
import type { SubmitDiagnosticInput } from "../validators/diagnostics.validators";


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

  //-------------------------------------//
  //        Soumettre un diagnostic      //
  //-------------------------------------//
  async submit(userId: string, data: SubmitDiagnosticInput) {

    //Récupérer toutes les questions actives du diagnostic
    const activeQuestions = await prisma.stressQuestion.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    //Transformer les questions en liste d'id : [{id:q1},{id:q2}] → ["q1","q2"]
    const activeQuestionIds = activeQuestions.map((question) => question.id);

    //Récupérer les questions envoyées par le front : [{q1,a3},{q2,a7}] → ["q1","q2"]
    const sentQuestionIds = data.answers.map((item) => item.questionId);

    //Set enlève automatiquement les doublons
    const uniqueQuestionIds = new Set(sentQuestionIds);

    //Si le nombre de questions uniques est différent du nombre de réponses alors une question a été envoyée plusieurs fois
    if (uniqueQuestionIds.size !== data.answers.length) {
      return { ok: false as const, error: "DUPLICATE_QUESTION" as const };
    }

    //Vérifier que toutes les questions ont une réponse
    if (data.answers.length !== activeQuestionIds.length) {
      return { ok: false as const, error: "MISSING_ANSWERS" as const };
    }

    //Récupérer les ids des réponses envoyées
    const answerIds = data.answers.map((item) => item.answerId);

    //Récupérer les réponses dans la base de données
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

    //Créer une Map pour retrouver rapidement une réponse par son id
    const answerById = new Map(
      selectedAnswers.map((answer) => [answer.id, answer])
    );

    //Calculer le score total du diagnostic
    const score = selectedAnswers.reduce((total, answer) => total + answer.weight, 0);

    //Déterminer le niveau de stress
    let level: "LOW" | "MEDIUM" | "HIGH";

    if (score < 150) {
      level = "LOW";
    } else if (score <= 300) {
      level = "MEDIUM";
    } else {
      level = "HIGH";
    }
    //Enregistrer le diagnostic dans la base
    const diagnostic = await prisma.stressDiagnostic.create({
      data: {
        userId,
        score,
        level,

        //Enregistrer aussi les réponses choisies
        answers: {
          create: data.answers.map((item) => ({
            questionId: item.questionId,
            answerId: item.answerId,
          })),
        },
      },
      select: {
        id: true,
        score: true,
        level: true,
        createdAt: true,
      },
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
      select: {
        id: true,
        score: true,
        level: true,
        createdAt: true
      }
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
      select: {
        id: true,
        label: true,
        order: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        answers: {
          orderBy: {
            order: "asc",
          },
          select: {
            id: true,
            label: true,
            weight: true,
            order: true,
            isActive: true,
          },
        },
      },
    });

    return questions;
  },




};