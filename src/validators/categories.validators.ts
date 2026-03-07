import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(50),
});

export const categoryIdParamSchema = z.object({
  id: CommonSchemas.uuidSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;