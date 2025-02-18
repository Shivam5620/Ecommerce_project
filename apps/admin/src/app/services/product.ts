import { endpoints } from "@repo/ui/lib/constants";
import { IProduct } from "@repo/ui/types/product";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";

export const fetchProducts = async (
  query: any,
): Promise<AxiosResponse<APIResponse<Array<IProduct>>>> => {
  return await ax({
    method: "get",
    url: endpoints.product.index,
    params: query,
  });
};

export const fetchWarehouses = async (
  query: any,
): Promise<AxiosResponse<APIResponse<Array<string>>>> => {
  return await ax({
    method: "get",
    url: endpoints.product.warehouse,
    params: query,
  });
};

export const fetchProductBrands = async (
  query: any,
): Promise<AxiosResponse<APIResponse<Array<string>>>> => {
  return await ax({
    method: "get",
    url: endpoints.product.brands,
    params: query,
  });
};

export const uploadProductImage = async (
  formData: FormData,
): Promise<AxiosResponse<APIResponse<IProduct[]>>> => {
  return await ax({
    method: "post",
    url: endpoints.product.setProductImage,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchImportProducts = async (): Promise<
  AxiosResponse<APIResponse<IProduct[]>>
> => {
  return await ax({
    method: "post",
    url: endpoints.product.import,
  });
};
