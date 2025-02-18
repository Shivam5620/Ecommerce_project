import { IOrder } from "./order";
import { IOrderDispatch } from "./orderDispatch";
import { ITransport } from "./transport";
import { IUser } from "./user";

export interface IBilty {
  dispatch_id: string;
  transport_id: string;
  order_id: string;
  created_by: string;
  image: string;

  // Lookups
  dispatch?: IOrderDispatch;
  order?: IOrder;
  transport?: ITransport;
  user: IUser;
}

export interface IGetDispatchesByTransportDateQuery {
  vehicle_number: string;
  date: Date;
}

export interface ICreateBiltyRequestBody
  extends Omit<
    IBilty,
    | "transport_id"
    | "order_id"
    | "created_by"
    | "dispatch"
    | "order"
    | "user"
    | "transport"
  > {}
