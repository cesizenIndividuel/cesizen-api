import { Router } from "express";
import { uploadAvatar } from "../middlewares/upload.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";
import * as me from "../controllers/users.me.controller";
import * as admin from "../controllers/users.admin.controller";

export const usersRoutes = Router();

usersRoutes.use(requireAuth);

// ========== USER ==========//
usersRoutes.get("/me", me.getMe);
usersRoutes.patch("/me", me.updateMe);
usersRoutes.patch("/me/password", me.updateMyPassword);
usersRoutes.post("/me/avatar", uploadAvatar, me.updateMyAvatar);
usersRoutes.delete("/me", me.deleteMe);

// ========== ADMIN ==========//
usersRoutes.post("/", requireRole("ADMIN"), admin.createUser);
usersRoutes.get("/", requireRole("ADMIN"), admin.getUsers);
usersRoutes.get("/:id", requireRole("ADMIN"), admin.getUserById);
usersRoutes.patch("/:id", requireRole("ADMIN"), admin.updateUser);
usersRoutes.delete("/:id", requireRole("ADMIN"), admin.deleteUser);