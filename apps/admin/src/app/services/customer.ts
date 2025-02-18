import { AxiosResponse } from "axios";
import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import { ICustomer } from "@repo/ui/types/customer";

export const fetchAllCustomers = async (): Promise<
  AxiosResponse<APIResponse<Array<ICustomer>>>
> => {
  return await ax({
    method: "get",
    url: endpoints.customer.index,
  });
};

export const fetchImportCustomers = async (): Promise<
  AxiosResponse<APIResponse<Array<ICustomer>>>
> => {
  return await ax({
    method: "post",
    url: endpoints.customer.import,
  });
};
