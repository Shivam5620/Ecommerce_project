import { AxiosResponse } from "axios";
import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import {
  ICreateCustomerBeatRequestBody,
  ICustomerBeat,
} from "@repo/ui/types/customerBeat";

// Fetch All Customer Beats
export const fetchAllCustomerBeats = async (): Promise<
  AxiosResponse<APIResponse<Array<ICustomerBeat>>>
> => {
  return await ax({
    method: "get",
    url: endpoints.customerBeats.index,
  });
};

// Create a New Customer Beat
export const createCustomerBeat = async (
  customerBeat: ICreateCustomerBeatRequestBody,
): Promise<AxiosResponse<APIResponse<ICustomerBeat>>> => {
  return await ax({
    method: "post",
    url: endpoints.customerBeats.index,
    data: customerBeat,
  });
};

// Update an Existing Customer Beat
export const updateCustomerBeat = async (
  id: string,
  data: Partial<ICreateCustomerBeatRequestBody>,
): Promise<AxiosResponse<APIResponse<ICustomerBeat>>> => {
  return await ax({
    method: "put",
    url: endpoints.customerBeats.id.replace(":id", id), // Use the correct endpoint with the ID
    data,
  });
};
