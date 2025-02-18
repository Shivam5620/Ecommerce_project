import { AxiosResponse } from "axios";
import ax from "../../lib/axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import { IBilty } from "@repo/ui/types/bilty";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";

export const addBilty = async (
  data: FormData,
): Promise<AxiosResponse<APIResponse<IBilty>>> => {
  return await ax({
    method: "post",
    url: endpoints.bilty.index,
    data,
  });
};

export const getBiltys = async (): Promise<
  AxiosResponse<APIResponse<IBilty[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.bilty.index,
  });
};

export const getDispatchesByTransportAndDate = async (
  vehicle_number: string,
  date: string,
): Promise<AxiosResponse<APIResponse<IOrderDispatch[]>>> => {
  return await ax({
    method: "get",
    url: `${endpoints.bilty.dispatches}`,
    params: { vehicle_number, date },
  });
};
