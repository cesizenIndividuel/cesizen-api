import { Router } from "express";
import * as diagnostics from "../controllers/diagnostics.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const diagnosticsRoutes = Router();

diagnosticsRoutes.use(requireAuth);

diagnosticsRoutes.get("/questions", diagnostics.getDiagnosticQuestions);
diagnosticsRoutes.post("/", diagnostics.submitDiagnostic);