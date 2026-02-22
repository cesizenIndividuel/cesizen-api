import { Router } from "express";
import { uploadAvatar } from "../middlewares/upload.middleware";
import * as usersController from "../controllers/users.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole.middleware";

export const usersRoutes = Router();

usersRoutes.use(requireAuth);

// ========== USER ==========//
usersRoutes.get("/me", usersController.getMe);
usersRoutes.patch("/me", usersController.updateMe);
usersRoutes.patch("/me/password", usersController.updateMyPassword);
usersRoutes.post("/me/avatar", uploadAvatar, usersController.updateMyAvatar);
usersRoutes.delete("/me", usersController.deleteMe);

// ========== ADMIN ==========//
usersRoutes.post("/", requireRole("ADMIN"), usersController.createUser);
usersRoutes.get("/", requireRole("ADMIN"), usersController.getUsers);
usersRoutes.get("/:id", requireRole("ADMIN"), usersController.getUserById);
usersRoutes.patch("/:id", requireRole("ADMIN"), usersController.updateUser);
usersRoutes.delete("/:id", requireRole("ADMIN"), usersController.deleteUser);