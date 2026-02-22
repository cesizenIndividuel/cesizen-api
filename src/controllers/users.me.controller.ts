import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { asyncHandler, parseOr400 } from "../utils/http";
import { deleteAvatarFile } from "../utils/file";
import { updateUserSchema, changeMyPasswordSchema } from "../validators/users.validators";
import { usersService } from "../services/users.service";


//------------------------------------//
//     Les détails de mon compte      //
//------------------------------------//
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const user = await usersService.findById(userId);
  if (!user) return res.status(404).json({ error: "USER_NOT_FOUND" });

  return res.status(200).json(user);
});

//-------------------------------------//
//          MAJ de mon compte          //
//-------------------------------------//
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
//           MAJ de mon mdp            //
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
//          MAJ de ma photo            //
//-------------------------------------//
export const updateMyAvatar = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  if (!req.file) {
    return res.status(400).json({ error: "NO_FILE_UPLOADED" });
  }

  const avatarUrl = `/uploads/users/${req.file.filename}`;

  const result = await usersService.updateAvatar(userId, avatarUrl);

  if (!result.ok) {
    // si user inexistant, on supprime le fichier qu’on vient d’uploader
    deleteAvatarFile(avatarUrl);
    return res.status(404).json({ error: result.error });
  }

  // suppression ancienne image
  deleteAvatarFile(result.previousAvatarUrl);

  return res.status(200).json(result.user);
});

//-------------------------------------//
//         Supprimer mon compte        //
//-------------------------------------//
export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.auth!.userId;

  const result = await usersService.deleteById(userId);
  if (!result.ok) return res.status(404).json({ error: "USER_NOT_FOUND" });

  deleteAvatarFile(result.avatarUrl);

  return res.status(204).send();
});