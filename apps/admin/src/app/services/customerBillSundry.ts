import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import {
  ICustomerBillSundry,
  IGetAllCustomerBillSundriesQuery,
} from "@repo/ui/types/customerBillSundry";

export const fetchCustomerBillSundries = async (
  query?: IGetAllCustomerBillSundriesQuery,
) => {
  return ax<APIResponse<ICustomerBillSundry[]>>({
    method: "get",
    url: endpoints.customer.billSundry.index,
    params: query,
  });
};

export const fetchAddCustomerBillSundry = async (data: ICustomerBillSundry) => {
  return ax<APIResponse<ICustomerBillSundry>>({
    method: "post",
    url: endpoints.customer.billSundry.index,
    data,
  });
};
