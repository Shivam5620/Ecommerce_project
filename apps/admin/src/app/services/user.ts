import { endpoints } from "@repo/ui/lib/constants";
import { ICreateUserRequestBody, IUser } from "@repo/ui/types/user";
import { APIResponse } from "@repo/ui/types/response";
import { AxiosResponse } from "axios";
import ax from "../../lib/axios";

export const fetchUsers = async (): Promise<
  AxiosResponse<APIResponse<IUser[]>>
> => {
  return await ax({
    method: "get",
    url: endpoints.user.index,
  });
};

export const fetchAddUser = async (
  data: ICreateUserRequestBody,
): Promise<AxiosResponse<APIResponse<IUser>>> => {
  return await ax({
    method: "post",
    url: endpoints.user.index,
    data,
  });
};

export const fetchUpdateUser = async (
  id: string,
  data: Partial<IUser>,
): Promise<AxiosResponse<APIResponse<IUser>>> => {
  return await ax({
    method: "put",
    url: endpoints.user.id.replace(":id", id),
    data,
  });
};
