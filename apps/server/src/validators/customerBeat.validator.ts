import Joi from "joi";
import { ICreateCustomerBeatRequestBody } from "@repo/ui/dist/types/customerBeat";

export const addCustomerBeatInputSchema =
  Joi.object<ICreateCustomerBeatRequestBody>({
    name: Joi.string().required(),
    customer_codes: Joi.array().items(Joi.string()).required(),
  });

export const updateCustomerBeatInputSchema = Joi.object({
  name: Joi.string().optional(),
  customer_codes: Joi.array().items(Joi.string()).optional(),
});

export const getCustomerBeatByIdInputSchema = Joi.object({
  id: Joi.string().required(),
});
