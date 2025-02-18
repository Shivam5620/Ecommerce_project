import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import {
  ICreateCustomerDiscountRequestBody,
  ICustomerDiscount,
  IGetAllCustomerDiscountsQuery,
} from "@repo/ui/types/customerDiscount";

export const fetchCustomerDiscounts = async (
  query?: IGetAllCustomerDiscountsQuery,
) => {
  return ax<APIResponse<ICustomerDiscount[]>>({
    method: "get",
    url: endpoints.customer.discount.index,
    params: query,
  });
};

export const fetchAddCustomerDiscount = async (
  data: ICreateCustomerDiscountRequestBody,
) => {
  return ax<APIResponse<ICustomerDiscount>>({
    method: "post",
    url: endpoints.customer.discount.index,
    data,
  });
};

export const fetchDeleteCustomerDiscount = async (id: string) => {
  return ax<APIResponse<ICustomerDiscount>>({
    method: "delete",
    url: endpoints.customer.discount.id.replace(":id", id),
  });
};
