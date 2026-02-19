import { z } from "zod";

//Les règles
const emailSchema = z.email("Email invalide").trim();
const passwordSchema = z.string().min(8, "Mot de passe : 8 caractères minimum");
const uuidSchema = z.uuid("id invalide (UUID attendu)");
const firstNameSchema = z.string().min(1).max(50);
const lastNameSchema = z.string().min(1).max(50);


export const roleSchema = z.enum(["USER", "ADMIN"]);

//Verifie la creation d'un user
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional()
});

//Verifie l'Id d'un user
export const userIdParamSchema = z.object({
  id: uuidSchema
});

//Verifie la maj d'un user
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
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
