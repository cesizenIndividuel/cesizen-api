import { z } from "zod";
import * as CommonSchemas from "./common.schemas";

export const registerSchema = z.object({
  email: CommonSchemas.emailSchema,
  pseudo: CommonSchemas.pseudoSchema,
  password: CommonSchemas.passwordSchema,
  confirmPassword: CommonSchemas.passwordSchema,
  cguAccepted: z.boolean()
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Les mots de passe ne correspondent pas"
})
.refine((data) => data.cguAccepted === true, {
  path: ["cguAccepted"],
  message: "Vous devez accepter les CGU"
});

export type RegisterInput = z.infer<typeof registerSchema>;