import { AxiosResponse } from "axios";
import { IRole } from "@repo/ui/types/role";
import { APIResponse } from "@repo/ui/types/response";
import { endpoints } from "@repo/ui/lib/constants";
import ax from "../../lib/axios";
import { IPermission } from "@repo/ui/types/permission";

export const fetchAllRoles = async (): Promise<
  AxiosResponse<APIResponse<Array<IRole>>>
> => {
  return await ax({
    method: "get",
    url: endpoints.role.index,
  });
};

export const fetchCreateRole = async (
  data: IRole,
): Promise<AxiosResponse<APIResponse<IRole>>> => {
  return await ax({
    method: "post",
    url: endpoints.role.index,
    data,
  });
};

export const fetchAllPermissions = async (): Promise<
  AxiosResponse<APIResponse<Array<IPermission>>>
> => {
  return await ax({
    method: "get",
    url: endpoints.permission.index,
  });
};

export const fetchUpdateRole = async (
  id: string,
  data: Partial<IRole>,
): Promise<AxiosResponse<APIResponse<IRole>>> => {
  return await ax({
    method: "put",
    url: endpoints.role.id.replace(":id", id),
    data,
  });
};
