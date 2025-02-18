import Joi, { ObjectSchema } from "joi";
import { IBrand } from "@repo/ui/dist/types/brand";

export const addBrandInputSchema = (() => {
  const brand = Joi.object<IBrand>({
    name: Joi.string().required(),
    image: Joi.string().optional(),
  });

  return {
    file: Joi.object().required().messages({
      "any.required": `"image" is required`,
    }),
    body: brand,
  };
})();

// export const updateBrandInputSchema = (() => {
//   const brand = Joi.object<IBrand>({
//     name: Joi.string().optional(),
//     image: Joi.string().optional(),
//   }).required();

//   return {
//     file: Joi.object(),
//     body: brand,
//     params: Joi.object({
//       id: Joi.string().required(),
//     }),
//   };
// })();
