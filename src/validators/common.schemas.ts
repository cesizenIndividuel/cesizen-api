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
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "Mot de passe : 8 caractères minimum");

export const firstNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(50);

export const lastNameSchema = z
  .string()
  .trim()
  .min(1)
  .max(50);

export const pseudoSchema = z
  .string()
  .trim()
  .min(3, "Pseudo : 3 caractères minimum")
  .max(30, "Pseudo : 30 caractères maximum");

export const roleSchema = z.enum(["USER", "ADMIN"]);