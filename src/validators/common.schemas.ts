import { z } from "zod";

//-------------------------------------//
//           Champs génériques         //
//-------------------------------------//

export const uuidSchema = z.uuid("Id invalide (UUID attendu)");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug obligatoire");

export const pageSchema = z
  .coerce.number()
  .int()
  .min(1)
  .default(1);

export const limitSchema = z
  .coerce.number()
  .int()
  .min(1)
  .max(50)
  .default(10);

export const searchQuerySchema = z
  .string()
  .trim()
  .min(1)
  .optional();

//-------------------------------------//
//             Champs user             //
//-------------------------------------//

export const emailSchema = z
  .email("Email invalide")
  .trim()
  .min(1, "Email obligatoire");

export const passwordSchema = z
  .string()
  .min(8, "Mot de passe : 8 caractères minimum");

export const firstNameSchema = z
  .string()
  .trim()
  .min(2, "Le prénom doit contenir au moins 2 caractères")
  .max(50, "Le prénom doit contenir au maximum 50 caractères");

export const lastNameSchema = z
  .string()
  .trim()
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom doit contenir au maximum 50 caractères");

export const pseudoSchema = z
  .string()
  .trim()
  .min(1, "Pseudo obligatoire")
  .min(3, "Le pseudo doit contenir au moins 3 caractères")
  .max(30, "Le pseudo doit contenir au maximum 30 caractères");

export const roleSchema = z.enum(["USER", "ADMIN"], {
  message: "Rôle invalide",
});