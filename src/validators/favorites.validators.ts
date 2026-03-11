import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//          Schéma favori base         //
//-------------------------------------//

const zFavorite = z.object({
  articleId: CommonSchemas.uuidSchema,
});


//-------------------------------------//
//        Id article favori            //
//-------------------------------------//

export const favoriteArticleIdParamSchema = zFavorite.pick({
  articleId: true,
});