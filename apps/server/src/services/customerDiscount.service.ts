import { ICustomerDiscount } from "@repo/ui/dist/types/customerDiscount";
import CustomerDiscountModel from "../models/customerDiscount.model";
import {
  FilterQuery,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
} from "mongoose";
import { CustomerDiscountType } from "@repo/ui/dist/enums/customerDiscount";

export const getAllCustomerDiscounts = async (
  filter: FilterQuery<ICustomerDiscount> = {},
  projection?: ProjectionType<ICustomerDiscount> | null | undefined,
  options?: QueryOptions<ICustomerDiscount> | null | undefined,
) => {
  return CustomerDiscountModel.find(filter, projection, options);
};

export const addCustomerDiscount = async (discount: ICustomerDiscount) => {
  const conditions: RootFilterQuery<ICustomerDiscount> = {
    customer_code: discount.customer_code,
    item_group_code: discount.item_group_code,
    type: discount.type,
  };

  if (discount.type === CustomerDiscountType.PRODUCT) {
    conditions.product_code = discount.product_code;
  }

  const existingDiscount = await CustomerDiscountModel.findOne(conditions);

  if (existingDiscount) {
    throw new Error("Customer Discount already exists");
  }

  const newDiscount = new CustomerDiscountModel(discount);
  await newDiscount.save();
  return CustomerDiscountModel.findOne({ _id: newDiscount._id })
    .populate(["product", "item_group"])
    .lean();
};

export const deleteCustomerDiscount = async (id: string) => {
  return CustomerDiscountModel.findByIdAndDelete(id);
};
