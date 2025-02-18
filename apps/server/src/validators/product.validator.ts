import { IGetAllProductsQuery, IProduct } from "@repo/ui/dist/types/product";
import Joi from "joi";

export const getAllProductsInputSchema = (() => {
  return {
    query: Joi.object<IGetAllProductsQuery>({
      available: Joi.boolean().optional(),
      codes: Joi.array().items(Joi.string()).optional().default([]),
    }),
  };
})();

export const addProductInputSchema = (() => {
  const schema = Joi.object<IProduct>({
    name: Joi.string().required(),
    code: Joi.string().required(),
    brand: Joi.string().required(),
    category: Joi.array().items(Joi.string()).required(),
    MOQ: Joi.number().required(),
    color: Joi.string().required(),
    size: Joi.string().required(),
    sale_price: Joi.number().required(),
    discount: Joi.number().required(),
    quantity: Joi.number().required(),
    image: Joi.string().required(),
    rack_no: Joi.string().required(),
    status: Joi.boolean().required(),
    hasImage: Joi.boolean().required(),
  });

  return {
    body: schema,
  };
})();

export const importProductInputSchema = (() => {
  const productSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string(),
    brand: Joi.string(),
    category: Joi.string(),
    MOQ: Joi.alternatives()
      .try(
        Joi.string().pattern(/^\d+$/), // The field can be a string
        Joi.valid(null), // The field can also be null
      )
      .default(1)
      .required(),
    rack_no: Joi.string(),
    color: Joi.string(),
    size: Joi.string(),
    sale_price: Joi.number(),
    discount: Joi.number(),
    quantity: Joi.number(),
    image: Joi.any(),
    PRCTN: Joi.number(),
  }).required();

  return {
    body: Joi.array().items(productSchema),
  };
})();

export const setProductImageInputSchema = (() => {
  return {
    body: Joi.object({
      code: Joi.string().required(),
      color: Joi.string().required(),
    }),
  };
})();
