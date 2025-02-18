import Joi from "joi";
import { ICustomerBillSundry } from "@repo/ui/dist/types/customerBillSundry";
import { CustomerBillSundryType } from "@repo/ui/dist/enums/customerBillSundry";

export const addCustomerBillSundryInputSchema = (() => ({
  body: Joi.object<ICustomerBillSundry>({
    bill_sundry_code: Joi.string().required(),
    customer_code: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(CustomerBillSundryType))
      .required(),
    value: Joi.number().required(),
  }),
}))();
