import { Router } from "express";

import { createUser, getUsers, getUserById, deleteUser } from "../controllers/users.controller";


export const usersRoutes = Router();

usersRoutes.post("/", createUser);
usersRoutes.get("/", getUsers);
usersRoutes.get("/:id", getUserById);
usersRoutes.delete("/:id", deleteUser);

