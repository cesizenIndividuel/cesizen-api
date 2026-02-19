import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Email invalide").trim(),
  pseudo: z.string().min(3, "Pseudo: 3 caractères min").max(30, "Pseudo: 30 caractères max").trim(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  confirmPassword: z.string().min(8, "Mot de passe : 8 caractères minimum"),
  cguAccepted: z.boolean()
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Les mots de passe ne correspondent pas"
    });
  }
  if (data.cguAccepted !== true) {
    ctx.addIssue({
      code: "custom",
      path: ["cguAccepted"],
      message: "Vous devez accepter les CGU"
    });
  }
});

export type RegisterInput = z.infer<typeof registerSchema>;
