import { endpoints } from "@repo/ui/lib/constants";
import { IGetAllProductsQuery, IProduct } from "@repo/ui/types/product";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";

export const fetchProducts = async (
  query: IGetAllProductsQuery,
): Promise<AxiosResponse<APIResponse<Array<IProduct>>>> => {
  return await ax({
    method: "get",
    url: endpoints.product.index,
    params: query,
  });
};
