import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";
import { IOrder } from "@repo/ui/types/order";

export const fetchOrdersToTransport = async (): Promise<
  AxiosResponse<APIResponse<IOrder[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.transport.ordersToTransport,
  });
};

export const addTransport = async (
  data: any,
): Promise<AxiosResponse<APIResponse<any>>> => {
  return await ax({
    method: "post",
    url: endpoints.transport.index,
    data,
  });
};
