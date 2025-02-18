import { OrderStatus } from "../enums/order";
import { ICustomer } from "./customer";
import { IOrderDispatch } from "./orderDispatch";
import { IPaginateBaseQuery } from "./paginate";
import { IProduct, IProductSize } from "./product";

export interface IOrderItem {
  name: string;
  code: string;
  color: string;
  size: string;
  MOQ: number;
  MRP: number;
  price: number;
  sale_price: number;
  brand: string;
  discount_1: number;
  discount_2: number;
  discount_3: number;
  discount: number;
  qty: number;
  cgst_percentage: number;
  sgst_percentage: number;
  igst_percentage: number;
  subtotal: number;
  total: number;
  hsn_code: string;
  ean_code: string;
  dispatch_qty: number;
  pack_qty: number;
  comment: string;
  rack_no: string;
  product_details?: IProduct;
}

export interface IWarehouseStatus {
  warehouse: string;
  qty: number;
  dispatch_qty: number;
  pack_qty: number;
  dispatched: boolean;
  packed: boolean;
}

export interface IOrder {
  _id?: string;
  order_id: string;
  name: string;
  shop_name: string;
  transport_name: string;
  customer_code?: string;
  items: IOrderItem[];
  isd: number;
  mobile: number;
  city: string;
  subtotal: number;
  total: number;
  remark: string;
  status: OrderStatus;
  dispatches?: IOrderDispatch[];
  warehouse_status?: IWarehouseStatus[];
  batch_id: string;
  created_at?: Date;
  updated_at?: Date;

  // Virtual
  customer?: ICustomer;
}

export interface IGroupedOrderItem extends Omit<IOrderItem, "size"> {
  sizes: IProductSize[];
}

export interface ICreateOrderItemRequestBody
  extends Pick<IOrderItem, "size" | "color" | "comment" | "code" | "qty"> {}

export interface ICreateOrderRequestBody {
  shop_name: string;
  remark: string;
  isd: number;
  mobile: number;
  city: string;
  items: Array<ICreateOrderItemRequestBody>;
}

export interface IUpdateOrderItemRequestBody
  extends ICreateOrderItemRequestBody {
  id?: string;
  name?: string;
}

export interface IUpdateOrderRequestBody extends ICreateOrderItemRequestBody {
  items: Array<IUpdateOrderItemRequestBody>;
  customer_code?: string;
}

export interface ICancelOrdersRequestBody {
  order_ids: string[];
}

export interface IBatchOrdersRequestBody {
  order_ids: string[];
}

export interface IDispatchOrderItemRequestBody {
  name: string;
  color: string;
  code: string;
  size: string;
  dispatch_qty: number;
}

export interface IDispatchOrderRequestBody {
  items: Array<IDispatchOrderItemRequestBody>;
  remark: string;
}

export interface IGetOrdersQuery {
  search?: string;
  select?: string;
  date?: Date;
}

export interface IGetPaginatedOrdersQuery extends IPaginateBaseQuery {
  search?: string;
  select?: string;
  date?: Date;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}
