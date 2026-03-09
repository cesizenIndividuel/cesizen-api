import { Router } from "express";
import * as diagnostics from "../controllers/diagnostics.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";


export const diagnosticsRoutes = Router();

diagnosticsRoutes.use(requireAuth);

// ========== USER ==========//
diagnosticsRoutes.get("/questions", diagnostics.getDiagnosticQuestions);
diagnosticsRoutes.post("/", diagnostics.submitDiagnostic);
diagnosticsRoutes.get("/history", diagnostics.getMyDiagnostics);

// ========== ADMIN ==========//
diagnosticsRoutes.get("/admin/questions", requireRole("ADMIN"), diagnostics.getDiagnosticQuestionsAdmin);
diagnosticsRoutes.patch("/admin/questions/:id", requireRole("ADMIN"), diagnostics.updateDiagnosticQuestion);