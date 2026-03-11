import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//           Schéma auth base          //
//-------------------------------------//

const zAuth = z.object({
  email: CommonSchemas.emailSchema,
  pseudo: CommonSchemas.pseudoSchema,
  password: CommonSchemas.passwordSchema,
  cguAccepted: z.boolean(),
});


//-------------------------------------//
//           Inscription user          //
//-------------------------------------//

export const registerSchema = zAuth
  .pick({
    email: true,
    pseudo: true,
    password: true,
    cguAccepted: true,
  })
  .extend({
    confirmPassword: zAuth.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas",
  })
  .refine((data) => data.cguAccepted === true, {
    path: ["cguAccepted"],
    message: "Vous devez accepter les CGU",
  });


//-------------------------------------//
//            Connexion user           //
//-------------------------------------//

export const loginSchema = zAuth.pick({
  email: true,
  password: true,
});


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;