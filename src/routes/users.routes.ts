import { Router } from "express";
import { createUser } from "../controllers/users.controller";

export const usersRoutes = Router();

usersRoutes.post("/", createUser);
