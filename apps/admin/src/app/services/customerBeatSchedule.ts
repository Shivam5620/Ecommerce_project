import { AxiosResponse } from "axios";
import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/types/customerBeatSchedule";

export const fetchAllCustomerBeatSchedule = async (): Promise<
  AxiosResponse<APIResponse<Array<ICustomerBeatSchedule>>>
> => {
  return await ax({
    method: "get",
    url: endpoints.customerBeatSchedule.index,
  });
};

// Create a New Customer Beat Schedule
export const createCustomerBeatSchedule = async (
  customerBeatSchedule: ICreateCustomerBeatScheduleRequestBody,
): Promise<AxiosResponse<APIResponse<Array<ICustomerBeatSchedule>>>> => {
  return await ax({
    method: "post",
    url: endpoints.customerBeatSchedule.index,
    data: customerBeatSchedule,
  });
};
// update an Existing CustomerBeat Schedule

export const updateCustomerBeatSchedule = async (
  id: string,
  data: Partial<ICustomerBeatSchedule>,
): Promise<AxiosResponse<APIResponse<ICustomerBeatSchedule>>> => {
  return await ax({
    method: "put",
    url: endpoints.customerBeatSchedule.id.replace(":id", id),
    data,
  });
};

// Delete a Customer Beat Schedule
export const deleteCustomerBeatSchedule = async (
  id: string,
): Promise<AxiosResponse<APIResponse<ICustomerBeatSchedule>>> => {
  return await ax({
    method: "delete",
    url: endpoints.customerBeatSchedule.id.replace(":id", id),
  });
};
