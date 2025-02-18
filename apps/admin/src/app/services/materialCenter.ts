import { endpoints } from "@repo/ui/lib/constants";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";
import { IMaterialCenter } from "@repo/ui/dist/types/materialCenter";

export const fetchAllMaterialCenters = async (): Promise<
  AxiosResponse<APIResponse<IMaterialCenter[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.materialCenter.index,
  });
};

export const fetchAddMaterialCenter = async (
  data: Partial<IMaterialCenter>,
): Promise<AxiosResponse<APIResponse<IMaterialCenter>>> => {
  return await ax({
    method: "post",
    url: endpoints.materialCenter.index,
    data,
  });
};

export const fetchUpdateMaterialCenter = async (
  id: string,
  data: Partial<IMaterialCenter>,
): Promise<AxiosResponse<APIResponse<IMaterialCenter>>> => {
  return await ax({
    method: "put",
    url: endpoints.materialCenter.id.replace(":id", id),
    data,
  });
};
