import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import {
  IBatchOrdersRequestBody,
  ICancelOrdersRequestBody,
  ICreateOrderRequestBody,
  IGetOrdersQuery,
  IGetPaginatedOrdersQuery,
  IOrder,
  IUpdateOrderRequestBody,
} from "@repo/ui/types/order";
import ax from "../../lib/axios";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import { PaginatedData } from "@repo/ui/types/paginate";

export const addOrder = async (
  data: ICreateOrderRequestBody,
): Promise<AxiosResponse<APIResponse<IOrder>>> => {
  return await ax({
    method: "post",
    url: endpoints.order.index,
    data,
  });
};

export const fetchAllOrders = async (
  params: IGetOrdersQuery,
): Promise<AxiosResponse<APIResponse<IOrder[]>>> => {
  return await ax({
    method: "get",
    url: endpoints.order.index,
    params,
  });
};
// Service to fetch paginated orders
export const fetchPaginatedOrders = async (
  params: IGetPaginatedOrdersQuery,
): Promise<AxiosResponse<APIResponse<PaginatedData<IOrder>>>> => {
  return await ax({
    method: "get",
    url: endpoints.order.paginated,
    params,
  });
};

export const fetchWpOrders = async (
  params: IGetOrdersQuery,
): Promise<AxiosResponse<APIResponse<IOrder[]>>> => {
  return await ax({
    method: "get",
    url: endpoints.dispatch.orders,
    params,
  });
};

export const fetchOrderById = async (
  id: string,
): Promise<AxiosResponse<APIResponse<IOrder>>> => {
  return await ax({
    method: "get",
    url: endpoints.order.id.replace(":id", id),
  });
};

export const fetchCancelOrder = async (
  data: ICancelOrdersRequestBody,
): Promise<AxiosResponse<APIResponse<IOrder[]>>> => {
  return await ax({
    method: "post",
    url: endpoints.order.cancel,
    data,
  });
};

export const fetchBatchOrder = async (
  data: IBatchOrdersRequestBody,
): Promise<AxiosResponse<APIResponse<Array<IOrder>>>> => {
  return await ax({
    method: "post",
    url: endpoints.order.batch,
    data,
  });
};

export const fetchDispatchOrder = async (
  id: string,
  data: FormData,
): Promise<AxiosResponse<APIResponse<IOrderDispatch>>> => {
  return await ax({
    method: "post",
    url: endpoints.order.dispatch.replace(":id", id),
    data,
  });
};

export const fetchUpdateOrder = async (
  id: string,
  data: Partial<IUpdateOrderRequestBody>,
): Promise<AxiosResponse<APIResponse<IOrder>>> => {
  return await ax({
    method: "put",
    url: endpoints.order.id.replace(":id", id),
    data,
  });
};
