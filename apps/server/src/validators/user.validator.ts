import Joi, { ObjectSchema } from "joi";
import { IUser } from "@repo/ui/dist/types/user";
import { UserType } from "@repo/ui/dist/enums/user";

export const addUserInputSchema = (() => {
  const schema = Joi.object<IUser>({
    vendor_id: Joi.number().optional(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(UserType))
      .required(),
    mobile: Joi.number().required(),
    image: Joi.string().default("default.jpg"),
    warehouses: Joi.array().items(Joi.string()).required().default([]),
    assignedRole: Joi.string().hex().length(24).required(),
    loading_id: Joi.string().hex().length(24).optional().allow(null),
  }).required();

  return {
    body: schema,
  };
})();

export const updateUserInputSchema = (() => {
  const schema = Joi.object<IUser>({
    _id: Joi.string().optional(),
    status: Joi.boolean(),
    vendor_id: Joi.number().optional(),
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    type: Joi.string().valid(...Object.values(UserType)),
    mobile: Joi.number(),
    image: Joi.string(),
    warehouses: Joi.array().items(Joi.string()),
    assignedRole: Joi.string(),
    loading_id: Joi.string().hex().length(24).optional().allow(null),
  });

  return {
    params: {
      id: Joi.string().required(),
    },
    body: schema,
  };
})();
