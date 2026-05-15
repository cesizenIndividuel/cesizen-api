import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Création / mise à jour de l'admin recette
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin.recette@elyzen.fr" },
    update: {},
    create: {
      email: "admin.recette@elyzen.fr",
      password: adminPassword,
      pseudo: "admin-recette",
      role: "ADMIN",
      isActive: true,
      cguAcceptedAt: new Date(),
    },
  });

  console.log("Admin de recette créé");

  // Nettoyage des données diagnostic
  await prisma.stressDiagnosticAnswer.deleteMany();
  await prisma.stressDiagnostic.deleteMany();
  await prisma.stressAnswer.deleteMany();
  await prisma.stressQuestion.deleteMany();

  // Questions du diagnostic
  const questions = [
    {
      label: "Avez-vous vécu le décès de votre conjoint(e) ?",
      order: 1,
      yesWeight: 100,
    },
    {
      label: "Avez-vous vécu un divorce ?",
      order: 2,
      yesWeight: 73,
    },
    {
      label: "Avez-vous vécu une séparation conjugale ?",
      order: 3,
      yesWeight: 65,
    },
    {
      label: "Avez-vous vécu le décès d'un membre proche de votre famille ?",
      order: 4,
      yesWeight: 63,
    },
    {
      label: "Avez-vous subi une maladie ou une blessure importante ?",
      order: 5,
      yesWeight: 53,
    },
    {
      label: "Vous êtes-vous marié(e) ?",
      order: 6,
      yesWeight: 50,
    },
    {
      label: "Avez-vous perdu votre emploi ?",
      order: 7,
      yesWeight: 47,
    },
    {
      label: "Avez-vous connu une réconciliation avec votre conjoint(e) ?",
      order: 8,
      yesWeight: 45,
    },
    {
      label: "Avez-vous pris votre retraite ?",
      order: 9,
      yesWeight: 45,
    },
    {
      label: "Avez-vous eu des difficultés financières importantes ?",
      order: 10,
      yesWeight: 38,
    },
    {
      label: "Avez-vous changé de travail récemment ?",
      order: 11,
      yesWeight: 36,
    },
    {
      label: "Avez-vous déménagé récemment ?",
      order: 12,
      yesWeight: 20,
    },
  ];

  for (const question of questions) {
    await prisma.stressQuestion.create({
      data: {
        label: question.label,
        order: question.order,
        answers: {
          create: [
            {
              label: "Oui",
              weight: question.yesWeight,
              order: 1,
            },
            {
              label: "Non",
              weight: 0,
              order: 2,
            },
          ],
        },
      },
    });
  }

  console.log("Seed diagnostic terminé");
}

main()
  .catch((e) => {
    console.error("Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });