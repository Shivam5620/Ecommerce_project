import { ICustomerBillSundry } from "@repo/ui/dist/types/customerBillSundry";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import CustomerBillSundryModel from "../models/customerBillSundry.model";

export const getAllCustomerBillSundries = async (
  filter: FilterQuery<ICustomerBillSundry> = {},
  projection?: ProjectionType<ICustomerBillSundry> | null | undefined,
  options?: QueryOptions<ICustomerBillSundry> | null | undefined,
) => {
  return CustomerBillSundryModel.find(filter, projection, options);
};

export const addCustomerBillSundry = async (discount: ICustomerBillSundry) => {
  const newCustomerBillSundry = new CustomerBillSundryModel(discount);
  await newCustomerBillSundry.save();
  return CustomerBillSundryModel.findOne({ _id: newCustomerBillSundry._id })
    .populate(["bill_sundry", "customer"])
    .lean();
};
