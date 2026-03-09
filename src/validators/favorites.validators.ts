import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const favoriteArticleIdParamSchema = z.object({
  articleId: CommonSchemas.uuidSchema,
});