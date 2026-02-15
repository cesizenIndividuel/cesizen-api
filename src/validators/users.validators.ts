import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email("Email invalide"),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum")
});

export const userIdParamSchema = z.object({
  id: z.uuid("id invalide (UUID attendu)")
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
