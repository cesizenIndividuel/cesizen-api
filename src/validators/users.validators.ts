import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//            Schéma user              //
//-------------------------------------//

const zUser = z.object({
  id: CommonSchemas.uuidSchema,
  email: CommonSchemas.emailSchema,
  password: CommonSchemas.passwordSchema,
  firstName: CommonSchemas.firstNameSchema,
  lastName: CommonSchemas.lastNameSchema,
  pseudo: CommonSchemas.pseudoSchema,
  role: CommonSchemas.roleSchema,
  isActive: z.boolean(),
});


//-------------------------------------//
//          Création user              //
//-------------------------------------//

export const createUserSchema = zUser
  .pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    pseudo: true,
    role: true,
    isActive: true,
  })
  .extend({
    firstName: zUser.shape.firstName.optional(),
    lastName: zUser.shape.lastName.optional(),
    role: zUser.shape.role.optional(),
    isActive: zUser.shape.isActive.optional(),
  });


//-------------------------------------//
//              Id user                //
//-------------------------------------//

export const userIdParamSchema = zUser.pick({
  id: true,
});


//-------------------------------------//
//           Mise à jour user          //
//-------------------------------------//

export const updateUserSchema = zUser
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni",
  });


//-------------------------------------//
//        Changer mot de passe         //
//-------------------------------------//

export const changeMyPasswordSchema = z
  .object({
    oldPassword: zUser.shape.password,
    newPassword: zUser.shape.password,
    confirmNewPassword: zUser.shape.password,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "Les mots de passe ne correspondent pas",
      });
    }
  });


//-------------------------------------//
//         Activer / désactiver        //
//-------------------------------------//

export const toggleUserStatusSchema = zUser.pick({
  isActive: true,
});


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangeMyPasswordInput = z.infer<typeof changeMyPasswordSchema>;