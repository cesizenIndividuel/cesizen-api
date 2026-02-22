import { Request, Response, NextFunction } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import { createUserSchema, userIdParamSchema, updateUserSchema, updatePasswordSchema, changeMyPasswordSchema } from "../validators/users.validators";
import { usersService } from "../services/users.service";
import fs from "fs";
import path from "path";

//----------------------------------//
//          Creer un user           //
//----------------------------------//
export const createUser = asyncHandler (async (req: Request, res: Response) => {
  // Validation du body
  const body = parseOr400 (createUserSchema, req.body, res)
  if (!body) return;

  const result = await usersService.create(body);
    if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }
  return res.status(201).json(result.user);
})

//----------------------------------//
//          Liste des user          //
//----------------------------------//
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await usersService.findAll();
  return res.status(200).json(users);
});

//------------------------------------//
//          Détail d'un user          //
//------------------------------------//
//USER
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const user = await usersService.findById(userId);
  if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

  return res.status(200).json(user);
});

//ADMIN
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400 (userIdParamSchema, req.params, res)
  if (!params) return;

  const user = await usersService.findById(params.id);
    if (!user){
    return res.status(404).json({ error: "USER_NOT_FOUND" });
  }
  return res.status(200).json(user);
});

//-------------------------------------//
//          Supprimer un user          //
//-------------------------------------//
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400 (userIdParamSchema, req.params, res)
  if (!params) return;

  const result = await usersService.deleteById(params.id);
  if (!result.ok){
      return res.status(404).json({ error: "USER_NOT_FOUND" });
  } 
  return res.status(204).send();
})

//-------------------------------------//
//            MAJ d'un user            //
//-------------------------------------//
//ADMIN
export const updateUser = asyncHandler (async (req: Request, res: Response) => {
  // Valider id
  const params = parseOr400 (userIdParamSchema, req.params, res)
  if (!params) return;

  //Valider Body
  const body = parseOr400 (updateUserSchema, req.body, res)
  if (!body) return;

  const result = await usersService.updateById(params.id, body);
  if (!result.ok) {
    if (result.error === "EMAIL_ALREADY_USED") {
      return res.status(409).json({ error: result.error });
    }
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result.user);
})

//USER
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const body = parseOr400(updateUserSchema, req.body, res);
  if (!body) return;

  const result = await usersService.updateById(userId, body);

  if (!result.ok) {
    if (result.error === "EMAIL_ALREADY_USED") {
      return res.status(409).json({ error: result.error });
    }
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.user);
});

//-------------------------------------//
//            MAJ d'un mdp             //
//-------------------------------------//

export const updateMyPassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const body = parseOr400(changeMyPasswordSchema, req.body, res);
  if (!body) return;

  const result = await usersService.changeMyPassword(userId, body);

  if (!result.ok) {
    if (result.error === "INVALID_OLD_PASSWORD") {
      return res.status(400).json({ error: result.error });
    }
    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});

//-------------------------------------//
//          MAJ de la photo            //
//-------------------------------------//
export const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(userIdParamSchema, req.params, res);
  if (!params) return;

  //Verifie qu'un fichier a été envoyé
  if (!req.file) {
    return res.status(400).json({ error: "NO_FILE_UPLOADED" });
  }

  //Creation de l'url de l'image
  const avatarUrl = `/uploads/users/${req.file.filename}`;
  const result = await usersService.updateAvatar(params.id, avatarUrl);

  // Si user inexistant -> on supprime le fichier uploadé
  if (!result.ok) {
    const uploadedPath = path.join(process.cwd(), "uploads", "users", req.file.filename);
    if (fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    return res.status(404).json({ error: result.error });
  }

  // Suppression de l'ancienne photo
  if (result.previousAvatarUrl) {
    const oldFilename = result.previousAvatarUrl.replace("/uploads/users/", "");
    const oldPath = path.join(process.cwd(), "uploads", "users", oldFilename);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  return res.status(200).json(result.user);
});
