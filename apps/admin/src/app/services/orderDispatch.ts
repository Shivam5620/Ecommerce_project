import {
  IGetOrderDispatchQuery,
  IOrderDispatch,
  IPaginatedOrderDispatchQuery,
} from "@repo/ui/types/orderDispatch";
import { PaginatedData } from "@repo/ui/types/paginate";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";
import { endpoints } from "@repo/ui/lib/constants";

export const fetchWpOrderLogs = async (
  query: IPaginatedOrderDispatchQuery,
): Promise<AxiosResponse<APIResponse<PaginatedData<IOrderDispatch>>>> => {
  return await ax({
    method: "get",
    url: endpoints.dispatch.wpOrderLogs,
    params: query,
  });
};

export const fetchOrderDispatches = async (
  query: IGetOrderDispatchQuery,
): Promise<AxiosResponse<APIResponse<IOrderDispatch[]>>> => {
  return await ax({
    method: "get",
    url: endpoints.dispatch.index,
    params: query,
  });
};

export const fetchOrderDispatchById = async (
  id: string,
): Promise<AxiosResponse<APIResponse<IOrderDispatch>>> => {
  return await ax({
    method: "get",
    url: endpoints.dispatch.id.replace(":id", id),
  });
};

export const fetchSyncInvoices = async (): Promise<
  APIResponse<{
    invoiceIds: string;
  }>
> => {
  return await ax({
    method: "post",
    url: endpoints.dispatch.syncInvoices,
  });
};
