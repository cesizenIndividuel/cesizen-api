import { z } from "zod";

//Les users
export const emailSchema = z.email("Email invalide").trim();
export const passwordSchema = z.string().min(8, "Mot de passe : 8 caractères minimum");
export const uuidSchema = z.uuid("id invalide (UUID attendu)");

export const firstNameSchema = z.string().min(1).max(50);
export const lastNameSchema = z.string().min(1).max(50);

export const pseudoSchema = z
  .string()
  .min(3, "Pseudo: 3 caractères min")
  .max(30, "Pseudo: 30 caractères max")
  .trim();

export const roleSchema = z.enum(["USER", "ADMIN"]);

//Les articles 

export const pageSchema = z
  .coerce.number()
  .int()
  .min(1)
  .default(1);

export const limitSchema = z
  .coerce.number() //string en int
  .int() //nombre entier
  .min(1)
  .max(50)
  .default(10);

export const searchQuerySchema = z
  .string()
  .trim()
  .min(1)
  .optional();