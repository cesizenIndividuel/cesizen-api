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

//-------------------------------------//
//    Lister les commentaires          //
//-------------------------------------//
export const getArticleComments = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(commentsValidators.commentArticleIdParamSchema, req.params, res);
  if (!params) return;

  const result = await commentsService.findByArticleId(params.id);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.comments);
});

//-------------------------------------//
//      Supprimer un commentaire       //
//-------------------------------------//
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const auth = req.auth!;
  const userId = auth.userId;
  const role = auth.role;

  const params = parseOr400(commentsValidators.commentIdParamSchema, req.params, res);
  if (!params) return;

  const result = await commentsService.deleteById(params.id, userId, role);

  if (!result.ok) {
    if (result.error === "FORBIDDEN") {
      return res.status(403).json({ error: result.error });
    }

    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});