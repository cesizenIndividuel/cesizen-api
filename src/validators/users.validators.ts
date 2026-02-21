import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

//Verifie la creation d'un user
export const createUserSchema = z.object({
  email: CommonSchemas.emailSchema,
  password: CommonSchemas.passwordSchema,
  firstName: CommonSchemas.firstNameSchema.optional(),
  lastName: CommonSchemas.lastNameSchema.optional(),
  pseudo: CommonSchemas.pseudoSchema,
  role: CommonSchemas.roleSchema.optional(),
  isActive: z.boolean().optional() 
});

//Verifie l'Id d'un user
export const userIdParamSchema = z.object({
  id: CommonSchemas.uuidSchema
});

//Verifie la maj d'un user
export const updateUserSchema = z.object({
  email: CommonSchemas.emailSchema.optional(),
  firstName: CommonSchemas.firstNameSchema.optional(),
  lastName: CommonSchemas.lastNameSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Au moins un champ doit être fourni"
  }
);

//Verifie la MAJ du mdp
export const updatePasswordSchema = z.object({
  password: CommonSchemas.passwordSchema
});


export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
