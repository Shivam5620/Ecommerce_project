import { AxiosResponse } from "axios";
import ax from "../../lib/axios";
import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import { IBrand } from "@repo/ui/types/brand";

export const addBrand = async (
  data: FormData,
): Promise<AxiosResponse<APIResponse<IBrand>>> => {
  return await ax({
    method: "post",
    url: endpoints.brand.index,
    data,
  });
};

export const getBrands = async (): Promise<
  AxiosResponse<APIResponse<IBrand[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.brand.index,
  });
};

export const deleteBrand = async (
  id: string,
): Promise<AxiosResponse<APIResponse<IBrand>>> => {
  return await ax({
    method: "delete",
    url: endpoints.brand.id.replace(":id", id),
  });
};
