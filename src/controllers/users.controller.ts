import { Request, Response, NextFunction } from "express";
import { createUserSchema, userIdParamSchema, updateUserSchema } from "../validators/users.validators";
import { usersService } from "../services/users.service";

//----------------------------------//
//          Creer un user           //
//----------------------------------//
export async function createUser(req: Request, res: Response, next: NextFunction) {
  // Validation du body (zod)
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.issues
    });
  }

  try {
      const result = await usersService.create(parsed.data);

      if (!result.ok) {
        return res.status(409).json({ error: result.error });
      }
      return res.status(201).json(result.user);
    } 
    catch (err) {
      return next(err);
    }
}

//----------------------------------//
//          Liste des user          //
//----------------------------------//
export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await usersService.findAll();
    return res.status(200).json(users);
  } 
  catch (err) {
    return next(err);
  }
}

//------------------------------------//
//          Détail d'un user          //
//------------------------------------//
export async function getUserById(req: Request, res: Response, next: NextFunction) {
  const parsed = userIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ 
      error: "VALIDATION_ERROR", 
      details: parsed.error.issues 
    });
  }

  try {
    const user = await usersService.findById(parsed.data.id);
    if (!user){
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
}

//-------------------------------------//
//          Supprimer un user          //
//-------------------------------------//
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const parsed = userIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ 
      error: "VALIDATION_ERROR", 
      details: parsed.error.issues 
    });
  }

  try {
    const result = await usersService.deleteById(parsed.data.id);
    if (!result.ok){
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    } 
    return res.status(204).send();
  } 
  catch (err) {
    return next(err);
  }
}

//-------------------------------------//
//            MAJ d'un user            //
//-------------------------------------//

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  // Valider id
  const idParsed = userIdParamSchema.safeParse(req.params);
  if (!idParsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: idParsed.error.issues });
  }

  // Valider body
  const bodyParsed = updateUserSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR", details: bodyParsed.error.issues });
  }

  try {
    const result = await usersService.updateById(idParsed.data.id, bodyParsed.data);

    if (!result.ok) {
      if (result.error === "EMAIL_ALREADY_USED") {
        return res.status(409).json({ error: result.error });
      }
      return res.status(404).json({ error: result.error });
    }

    return res.status(200).json(result.user);
  } 
  catch (err) {
    return next(err);
  }
}



