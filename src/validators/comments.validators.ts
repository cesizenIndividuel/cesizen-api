import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//         Schéma commentaire          //
//-------------------------------------//

const zComment = z.object({
  id: CommonSchemas.uuidSchema,
  articleId: CommonSchemas.uuidSchema,
  content: z.string().trim().min(1).max(1000),
});


//-------------------------------------//
//        Id article commentaire       //
//-------------------------------------//

export const commentArticleIdParamSchema = z.object({
  id: zComment.shape.articleId,
});


//-------------------------------------//
//         Création commentaire        //
//-------------------------------------//

export const createCommentSchema = zComment.pick({
  content: true,
});


//-------------------------------------//
//           Id commentaire            //
//-------------------------------------//

export const commentIdParamSchema = zComment.pick({
  id: true,
});


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type CreateCommentInput = z.infer<typeof createCommentSchema>;