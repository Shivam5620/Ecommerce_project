import { ICustomer } from "./customer";

export interface ICustomerBeat {
  _id: string;
  name: string;
  customer_codes: string[];
  created_at?: Date;
  updatedAt?: Date;

  // Virtuals
  customers?: ICustomer[];
}

export interface ICreateCustomerBeatRequestBody {
  name: string;
  customer_codes: string[];
}
