import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import * as comments from "../controllers/comments.controller";

export const commentsRoutes = Router();

commentsRoutes.use(requireAuth);

commentsRoutes.delete("/:id", comments.deleteComment);