import { Request, Response } from "express";
import { asyncHandler } from "../utils/http";
import { diagnosticsService } from "../services/diagnostics.service";

//-------------------------------------//
//      Lister les questions           //
//-------------------------------------//
export const getDiagnosticQuestions = asyncHandler(async (req: Request, res: Response) => {
  const result = await diagnosticsService.listQuestions();

  return res.status(200).json(result.questions);
});