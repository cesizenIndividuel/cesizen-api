import { Router } from "express";
import { uploadAvatar } from "../middlewares/upload.middleware";
import * as usersController from "../controllers/users.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const usersRoutes = Router();

// ========== USER (mon compte) ==========//
usersRoutes.get("/me", requireAuth, usersController.getMe);
usersRoutes.patch("/me", requireAuth, usersController.updateMe);
usersRoutes.patch("/me/password", requireAuth, usersController.updateMyPassword);
usersRoutes.post("/me/avatar", requireAuth, uploadAvatar, usersController.updateMyAvatar);
usersRoutes.delete("/me", requireAuth, usersController.deleteMe);

// ========== ADMIN (gestion des comptes) ==========//
usersRoutes.post("/", requireAuth, requireRole("ADMIN"), usersController.createUser);
usersRoutes.get("/", requireAuth, requireRole("ADMIN"), usersController.getUsers);
usersRoutes.get("/:id", requireAuth, requireRole("ADMIN"), usersController.getUserById);
usersRoutes.patch("/:id", requireAuth, requireRole("ADMIN"), usersController.updateUser);
usersRoutes.delete("/:id", requireAuth, requireRole("ADMIN"), usersController.deleteUser);