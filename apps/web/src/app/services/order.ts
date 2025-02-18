import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import { ICreateOrderRequestBody, IOrder } from "@repo/ui/types/order";
import ax from "../../lib/axios";

export const addOrder = async (
  data: ICreateOrderRequestBody,
): Promise<AxiosResponse<APIResponse<IOrder>>> => {
  return await ax({
    method: "post",
    url: endpoints.order.index,
    data,
  });
};
