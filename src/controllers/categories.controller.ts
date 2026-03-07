import { Request, Response } from "express";
import { asyncHandler, parseOr400 } from "../utils/http";
import * as categoriesValidators from "../validators/categories.validators";
import { categoriesService } from "../services/categories.service";

//----------------------------------//
//       Créer une catégorie        //
//----------------------------------//
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const body = parseOr400(categoriesValidators.createCategorySchema, req.body, res);
  if (!body) return;

  const result = await categoriesService.create(body);

  if (!result.ok) {
    return res.status(409).json({ error: result.error });
  }

  return res.status(201).json(result.category);
});

//----------------------------------//
//      Liste des catégories        //
//----------------------------------//
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoriesService.findAll();
  return res.status(200).json(categories);
});

//----------------------------------//
//      Modifier une catégorie      //
//----------------------------------//
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(categoriesValidators.categoryIdParamSchema, req.params, res);
  if (!params) return;

  const body = parseOr400(categoriesValidators.updateCategorySchema, req.body, res);
  if (!body) return;

  const result = await categoriesService.updateById(params.id, body);

  if (!result.ok) {
    if (result.error === "CATEGORY_NAME_ALREADY_USED") {
      return res.status(409).json({ error: result.error });
    }
    return res.status(404).json({ error: result.error });
  }

  return res.status(200).json(result.category);
});

//----------------------------------//
//     Supprimer une catégorie      //
//----------------------------------//
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const params = parseOr400(categoriesValidators.categoryIdParamSchema, req.params, res);
  if (!params) return;

  const result = await categoriesService.deleteById(params.id);

  if (!result.ok) {
    return res.status(404).json({ error: result.error });
  }

  return res.status(204).send();
});
