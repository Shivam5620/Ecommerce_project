import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import { ICreateShipmentRequestBody } from "@repo/ui/types/shipment";

export const fetchDispatchesToShip = async (): Promise<
  AxiosResponse<APIResponse<IOrderDispatch[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.shipment.dispatchesToShip,
  });
};

export const fetchShipDispatch = async (
  id: string,
  data: ICreateShipmentRequestBody,
): Promise<AxiosResponse<APIResponse<IOrderDispatch>>> => {
  return await ax({
    method: "put",
    url: endpoints.dispatch.id.replace(":id", id),
    data,
  });
};
