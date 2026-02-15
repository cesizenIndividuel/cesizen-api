import { z } from "zod";

//Verifie la creation d'un user
export const createUserSchema = z.object({
  email: z.email("Email invalide").trim(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum")
});

//Verifie l'Id d'un user
export const userIdParamSchema = z.object({
  id: z.uuid("id invalide (UUID attendu)")
});

//Verifie la maj d'un user
export const updateUserSchema = z.object({
  email: z.email("Email invalide").optional()
}).refine(
  (data) => data.email !== undefined,
  {
    message: "Au moins un champ doit être fourni"
  }
);

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
