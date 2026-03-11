import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//      Schéma réponse diagnostic      //
//-------------------------------------//

const zDiagnosticAnswer = z.object({
  id: CommonSchemas.uuidSchema,
  label: z.string().trim().min(1),
  weight: z.number().int().min(0),
  order: z.number().int().positive(),
});


//-------------------------------------//
//      Schéma question diagnostic     //
//-------------------------------------//

const zDiagnosticQuestion = z.object({
  id: CommonSchemas.uuidSchema,
  label: z.string().trim().min(1),
  order: z.number().int().positive(),
});


//-------------------------------------//
//    Schéma réponse soumission        //
//-------------------------------------//

const zDiagnosticSubmissionAnswer = z.object({
  questionId: CommonSchemas.uuidSchema,
  answerId: CommonSchemas.uuidSchema,
});


//-------------------------------------//
//       Soumettre un diagnostic       //
//-------------------------------------//

export const submitDiagnosticSchema = z.object({
  answers: z
    .array(zDiagnosticSubmissionAnswer)
    .min(1, "Au moins une réponse doit être fournie"),
});


//-------------------------------------//
//         Id question diagnostic      //
//-------------------------------------//

export const diagnosticQuestionIdParamSchema = zDiagnosticQuestion.pick({
  id: true,
});


//-------------------------------------//
//     Mise à jour question diag       //
//-------------------------------------//

export const updateDiagnosticQuestionSchema = zDiagnosticQuestion
  .pick({
    label: true,
    order: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
  });


//-------------------------------------//
//          Id réponse diagnostic      //
//-------------------------------------//

export const diagnosticAnswerIdParamSchema = zDiagnosticAnswer.pick({
  id: true,
});


//-------------------------------------//
//      Mise à jour réponse diag       //
//-------------------------------------//

export const updateDiagnosticAnswerSchema = zDiagnosticAnswer
  .pick({
    label: true,
    weight: true,
    order: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
  });


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type SubmitDiagnosticInput = z.infer<typeof submitDiagnosticSchema>;
export type UpdateDiagnosticQuestionInput = z.infer<typeof updateDiagnosticQuestionSchema>;
export type UpdateDiagnosticAnswerInput = z.infer<typeof updateDiagnosticAnswerSchema>;