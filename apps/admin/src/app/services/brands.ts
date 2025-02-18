import { endpoints } from "@repo/ui/lib/constants";
import { IBrand } from "@repo/ui/types/brand";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";

export const fetchBrands = async (
  query: any,
): Promise<AxiosResponse<APIResponse<Array<IBrand>>>> => {
  return await ax({
    method: "get",
    url: endpoints.brand.index,
    params: query,
  });
};
