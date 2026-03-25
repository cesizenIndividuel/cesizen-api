import { z } from "zod";
import * as CommonSchemas from "./common.schemas";


//-------------------------------------//
//        Schéma catégorie base        //
//-------------------------------------//

const zCategory = z.object({
  id: CommonSchemas.uuidSchema,
  name: z.string().trim().min(2).max(50),
});


//-------------------------------------//
//        Création catégorie           //
//-------------------------------------//

export const createCategorySchema = zCategory.pick({
  name: true,
});


//-------------------------------------//
//            Id catégorie             //
//-------------------------------------//

export const categoryIdParamSchema = zCategory.pick({
  id: true,
});


//-------------------------------------//
//         Mise à jour catégorie       //
//-------------------------------------//

export const updateCategorySchema = zCategory
  .pick({
    name: true,
  })
  .partial();


//-------------------------------------//
//               Types                 //
//-------------------------------------//

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;