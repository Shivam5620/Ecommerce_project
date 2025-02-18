import { AxiosResponse } from "axios";
import ax, { APIResponse } from "../../lib/axios";
import { IChangePasswordBody, ILoginBody } from "@repo/ui/types/auth";
import { endpoints } from "@repo/ui/lib/constants";
import { IUser } from "@repo/ui/types/user";
export const fetchLogin = async (
  data: ILoginBody,
): Promise<AxiosResponse<APIResponse<IUser>>> => {
  return await ax({
    method: "post",
    url: endpoints.auth.login,
    data,
  });
};

export const fetchLogout = async (): Promise<
  AxiosResponse<APIResponse<any>>
> => {
  return await ax({
    method: "post",
    url: endpoints.auth.logout,
  });
};

export const fetchChangePassword = async (
  data: IChangePasswordBody,
): Promise<AxiosResponse<APIResponse<null>>> => {
  return await ax({
    method: "post",
    url: endpoints.auth.changePassword,
    data,
  });
};
