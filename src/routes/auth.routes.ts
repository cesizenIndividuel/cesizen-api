import { Router } from "express";
import { register } from "../controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", register);
