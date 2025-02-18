import { AxiosResponse } from "axios";
import { endpoints } from "@repo/ui/lib/constants";
import { ICreateLoadingRequestBody, ILoading } from "@repo/ui/types/loading";
import { APIResponse } from "@repo/ui/types/response";
import ax from "../../lib/axios";

export const fetchLoadings = async (): Promise<
  AxiosResponse<APIResponse<ILoading[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.loading.index,
  });
};

export const fetchAddLoading = async (
  data: ICreateLoadingRequestBody,
): Promise<AxiosResponse<APIResponse<ILoading | null>>> => {
  return await ax({
    method: "post",
    url: endpoints.loading.index,
    data,
  });
};

export const fetchUpdateLoading = async (
  id: string,
  data: Partial<ILoading>,
): Promise<AxiosResponse<APIResponse<ILoading | null>>> => {
  return await ax({
    method: "put",
    url: endpoints.loading.id.replace(":id", id),
    data,
  });
};
