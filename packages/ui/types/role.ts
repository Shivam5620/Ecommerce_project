import { IPermission } from "./permission";

export interface IRole {
  _id?: string;
  name: string;
  description: string;
  permissions: IPermission[];
}
