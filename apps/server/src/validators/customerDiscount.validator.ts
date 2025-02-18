import Joi from "joi";
import { ICreateCustomerDiscountRequestBody } from "@repo/ui/dist/types/customerDiscount";
import { CustomerDiscountType } from "@repo/ui/dist/enums/customerDiscount";

export const addCustomerDiscountInputSchema = (() => ({
  body: Joi.object<ICreateCustomerDiscountRequestBody>({
    item_group_code: Joi.string().required(),
    customer_code: Joi.string().required(),
    product_code: Joi.string().optional().allow(null),
    discount_1: Joi.number().required(),
    discount_2: Joi.number().required(),
    discount_3: Joi.number().required(),
    type: Joi.string()
      .valid(...Object.values(CustomerDiscountType))
      .required(),
    comment: Joi.string().optional().allow(""),
  }).required(),
}))();
