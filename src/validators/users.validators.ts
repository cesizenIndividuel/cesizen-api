import { z } from "zod";

//Les règles
const emailSchema = z.string().email("Email invalide").trim();

const passwordSchema = z.string().min(8, "Mot de passe : 8 caractères minimum");

const uuidSchema = z.string().uuid("id invalide (UUID attendu)");

//Verifie la creation d'un user
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

//Verifie l'Id d'un user
export const userIdParamSchema = z.object({
  id: uuidSchema
});

//Verifie la maj d'un user
export const updateUserSchema = z.object({
  email: emailSchema.optional()
}).refine(
  (data) => data.email !== undefined,
  {
    message: "Au moins un champ doit être fourni"
  }
);

//Verifie la MAJ du mdp
export const updatePasswordSchema = z.object({
  password: passwordSchema
});



export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
