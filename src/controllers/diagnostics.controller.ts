import { Request, Response } from "express";
import { asyncHandler,parseOr400 } from "../utils/http";
import { diagnosticsService } from "../services/diagnostics.service";
import * as diagnosticsValidators from "../validators/diagnostics.validators";

//-------------------------------------//
//      Lister les questions           //
//-------------------------------------//
export const getDiagnosticQuestions = asyncHandler(async (req: Request, res: Response) => {
  const result = await diagnosticsService.listQuestions();

  return res.status(200).json(result.questions);
});

//-------------------------------------//
//      Soumettre un diagnostic        //
//-------------------------------------//
export const submitDiagnostic = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const body = parseOr400(diagnosticsValidators.submitDiagnosticSchema, req.body, res);
  if (!body) return;

  const result = await diagnosticsService.submit(userId, body);

  if (!result.ok) {
   return res.status(400).json({ error: result.error });
  }

  return res.status(201).json(result.diagnostic);
});

//-------------------------------------//
//     Historique de mes diagnostics   //
//-------------------------------------//
export const getMyDiagnostics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const diagnostics = await diagnosticsService.findMyDiagnostics(userId);

  return res.status(200).json(diagnostics);
});

//-------------------------------------//
//   Admin - Liste des questions       //
//-------------------------------------//
export const getDiagnosticQuestionsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const questions = await diagnosticsService.findAllQuestionsForAdmin();

  return res.status(200).json(questions);
});

//-------------------------------------//
//   Admin - Modifier une question     //
//-------------------------------------//
export const updateDiagnosticQuestion = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(diagnosticsValidators.diagnosticQuestionIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(diagnosticsValidators.updateDiagnosticQuestionSchema, req.body, res);
  if (!body) return;

  const result = await diagnosticsService.updateQuestionById(params.id, body);

  if (!result.ok) {
    if (result.error === "QUESTION_ORDER_ALREADY_USED") {
      return res.status(409).json({ error: result.error });
    }

    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.question);
});

//-------------------------------------//
//    Admin - Modifier une réponse     //
//-------------------------------------//
export const updateDiagnosticAnswer = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(diagnosticsValidators.diagnosticAnswerIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(diagnosticsValidators.updateDiagnosticAnswerSchema, req.body, res);
  if (!body) return;

  const result = await diagnosticsService.updateAnswerById(params.id, body);

  if (!result.ok) {
    if (result.error === "ANSWER_ORDER_ALREADY_USED") {
      return res.status(409).json({ error: result.error });
    }

    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.answer);
});