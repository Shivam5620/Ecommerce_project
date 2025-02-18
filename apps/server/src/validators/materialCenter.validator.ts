import Joi, { ObjectSchema } from "joi";
import { IMaterialCenter } from "@repo/ui/dist/types/materialCenter";
export const addMaterialCenterInputSchema = (() => {
  const schema = Joi.object<IMaterialCenter>({
    name: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow(""),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pinCode: Joi.string().required(),
    status: Joi.boolean().required(),
  }).required();

  return {
    body: schema,
  };
})();

export const updateMaterialCenterInputSchema = (() => {
  const schema = Joi.object<IMaterialCenter>({
    _id: Joi.string().optional(),
    name: Joi.string(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string().allow(""),
    city: Joi.string(),
    state: Joi.string(),
    pinCode: Joi.string(),
    status: Joi.boolean(),
  });

  return {
    params: {
      id: Joi.string().required(),
    },
    body: schema,
  };
})();
