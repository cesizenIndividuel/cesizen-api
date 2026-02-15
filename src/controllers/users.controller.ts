import { Request, Response, NextFunction } from "express";
import { createUserSchema } from "../validators/users.validators";
import { usersService } from "../services/users.service";

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


export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await usersService.findAll();
    return res.status(200).json(users);
  } 
  catch (err) {
    return next(err);
  }
}

