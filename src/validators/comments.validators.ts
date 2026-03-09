import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const commentArticleIdParamSchema = z.object({
  id: CommonSchemas.uuidSchema,
});

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;