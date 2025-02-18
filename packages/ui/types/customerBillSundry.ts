import { IBillSundry } from "./billSundry";
import { ICustomer } from "./customer";
import { CustomerBillSundryType } from "../enums/customerBillSundry";

export interface IGetAllCustomerBillSundriesQuery {
  customer_code?: string;
}

export interface ICustomerBillSundry {
  bill_sundry_code: string;
  customer_code: string;
  type: CustomerBillSundryType;
  value: number;
  created_at?: Date;
  updated_at?: Date;

  // Virtual
  customer?: ICustomer;
  bill_sundry?: IBillSundry;
}
