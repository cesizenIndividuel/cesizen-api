import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const submitDiagnosticSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: CommonSchemas.uuidSchema,
        answerId: CommonSchemas.uuidSchema,
      })
    )
    .min(1, "Au moins une réponse doit être fournie"),
});

export const diagnosticQuestionIdParamSchema = z.object({
  id: CommonSchemas.uuidSchema,
});

export const updateDiagnosticQuestionSchema = z
  .object({
    label: z.string().trim().min(1).optional(),
    order: z.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
  });

export type SubmitDiagnosticInput = z.infer<typeof submitDiagnosticSchema>;
export type UpdateDiagnosticQuestionInput = z.infer<typeof updateDiagnosticQuestionSchema>;