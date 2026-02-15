import { Request, Response } from "express";
import { createUserSchema } from "../validators/users.validators";
import { usersService } from "../services/users.service";

export async function createUser(req: Request, res: Response) {
  // Validation du body (zod)
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      details: parsed.error.issues
    });
  }

  // Appel service
  const result = await usersService.create(parsed.data);

  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  return res.status(201).json(result.user);
}


export async function getUsers(req: Request, res: Response) {
  const users = await usersService.findAll();
  return res.status(200).json(users);
}

