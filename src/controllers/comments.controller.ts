import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { commentsService } from "../services/comments.service";
import * as commentsValidators from "../validators/comments.validators";

//-------------------------------------//
//        Créer un commentaire         //
//-------------------------------------//
export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const params = parseOr400(commentsValidators.commentArticleIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(commentsValidators.createCommentSchema, req.body, res);
  if (!body) return;

  const result = await commentsService.create(params.id, userId, body);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(201).json(result.comment);
});