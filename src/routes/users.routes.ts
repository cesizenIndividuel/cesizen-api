import { Router } from "express";
import { uploadAvatar } from "../middlewares/upload.middleware";
import * as usersController from "../controllers/users.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware";


export const usersRoutes = Router();

usersRoutes.post("/", requireAuth, requireAdmin, usersController.createUser);
usersRoutes.get("/", usersController.getUsers);
usersRoutes.get("/:id", usersController.getUserById);
usersRoutes.delete("/:id", usersController.deleteUser);
usersRoutes.patch("/:id", usersController.updateUser);
usersRoutes.patch("/:id/password", usersController.updateUserPassword);
usersRoutes.post("/:id/avatar", uploadAvatar, usersController.updateUserAvatar
);

