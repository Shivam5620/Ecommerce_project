import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import { IOrderLoad } from "@repo/ui/types/orderLoad";

export const fetchDispatchesToLoad = async (): Promise<
  AxiosResponse<APIResponse<IOrderDispatch[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.orderLoad.dispatchesToLoad,
  });
};

export const fetchAddOrderLoad = async (
  data: FormData,
): Promise<AxiosResponse<APIResponse<IOrderLoad>>> => {
  return await ax({
    method: "post",
    url: endpoints.orderLoad.index,
    data,
  });
};
