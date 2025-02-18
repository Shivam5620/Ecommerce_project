import { UserType } from "../enums/user";
import { IBilty } from "./bilty";
import { IOrder } from "./order";
import { IOrderLoad } from "./orderLoad";
import { IPaginateBaseQuery } from "./paginate";

export interface IOrderDispatchItem {
  name: string;
  color: string;
  code: string;
  size: string;
  dispatch_qty: number;
  // total: number;
  // discount_1: number;
  // discount_2: number;
  // discount_3: number;
  // hsn_code: string;
  // sale_price: number;
  // price: number;
  // cgst_percentage: number;
  // sgst_percentage: number;
  // igst_percentage: number;
}

// export interface IOrderDispatchItem
//   extends Omit<IOrderItem, "product_details"> {}

export interface IOrderDispatch {
  _id?: string;
  is_final: boolean;
  cartons: number;
  open_boxes: number;
  items: Array<IOrderDispatchItem>;
  remark: string;
  dispatch_id: string;
  image: string | null;
  order_id: string;
  created_by: string;
  order_load_id: string;
  bilty_id: string;
  synced: boolean;
  dispatched_by: UserType;
  created_at: Date;
  updated_at: Date;

  // Lookups
  bilty: IBilty;
  order: IOrder;
  order_load: IOrderLoad;
}

export interface IGetOrderDispatchQuery {
  dispatch_ids?: string[];
}

export interface IPaginatedOrderDispatchQuery extends IPaginateBaseQuery {
  search?: string;
  date?: Date;
}
