import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const submitDiagnosticSchema = z.object({
  answers: z.array(
      z.object({
        questionId: CommonSchemas.uuidSchema,
        answerId: CommonSchemas.uuidSchema,
      })
    )
    .min(1, "Au moins une réponse doit être fournie"),
});

export type SubmitDiagnosticInput = z.infer<typeof submitDiagnosticSchema>;