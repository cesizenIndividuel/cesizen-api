import { Request, Response } from "express";
import { deleteUploadedFile } from "../utils/file";
import { asyncHandler, parseOr400 } from "../utils/http";
import * as userValidators from "../validators/users.validators";import { usersService } from "../services/users.service";

//----------------------------------//
//          Creer un user           //
//----------------------------------//
export const createUser = asyncHandler (async (req: Request, res: Response) => {
  // Validation du body
  const body = parseOr400 (userValidators.createUserSchema, req.body, res)
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
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400 (userValidators.userIdParamSchema, req.params, res)
  if (!params) return;

  const user = await usersService.findById(params.id);
    if (!user){
    return res.status(404).json({ error: "USER_NOT_FOUND" });
  }
  return res.status(200).json(user);
});

//-------------------------------------//
//            MAJ d'un user            //
//-------------------------------------//
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(userValidators.userIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(userValidators.updateUserSchema, req.body, res);
  if (!body) return;

  const result = await usersService.updateById(params.id, body);

  if (!result.ok) {
    if (
      result.error === "EMAIL_ALREADY_USED" ||
      result.error === "PSEUDO_ALREADY_USED"
    ) {
      return res.status(409).json({ error: result.error });
    }

    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.user);
});

//-------------------------------------//
//          Supprimer un user          //
//-------------------------------------//
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(userValidators.userIdParamSchema, req.params, res);
  if (!params) return;

  const result = await usersService.deleteById(params.id);

  if (!result.ok) {
    return res.status(404).json({ error: "USER_NOT_FOUND" });
  }

  deleteUploadedFile(result.avatarUrl);

  return res.status(204).send();
});

//-------------------------------------//
//         Désactiver un user          //
//-------------------------------------//
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(userValidators.userIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(userValidators.toggleUserStatusSchema, req.body, res);
  if (!body) return;

  const result = await usersService.toggleUserStatus(params.id, body.isActive);

  if (!result.ok) {
    if (result.error === "USER_NOT_FOUND") {
      return res.status(404).json({ error: result.error });
    }
    if (result.error === "CANNOT_DISABLE_ADMIN") {
      return res.status(403).json({ error: result.error });
    }
  }

  return res.status(200).json(result.user);
});