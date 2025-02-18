import { CustomerDiscountType } from "../enums/customerDiscount";
import { IBillSundry } from "./billSundry";
import { IItemGroup } from "./itemGroup";
import { IProduct } from "./product";

export interface IGetAllCustomerDiscountsQuery {
  customer_code?: string;
}

export interface ICustomerDiscount {
  _id?: string;
  item_group_code: string;
  product_code: string;
  customer_code: string;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  type: CustomerDiscountType;
  comment: string;
  created_at?: Date;
  updated_at?: Date;

  // Virtual
  product?: IProduct;
  item_group?: IItemGroup;
  bill_sundry?: IBillSundry;
}

export interface ICreateCustomerDiscountRequestBody
  extends Omit<
    ICustomerDiscount,
    "_id" | "created_at" | "updated_at" | "product_code"
  > {
  product_code: string | null;
}
