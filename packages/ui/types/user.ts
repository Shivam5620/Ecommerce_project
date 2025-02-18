import { UserType } from "../enums/user";
import { IRole } from "./role";

export interface IUser {
  _id?: string;
  status: boolean;
  vendor_id: number;
  name: string;
  assignedRole: string;
  role: IRole;
  email: string;
  password: string;
  type: UserType;
  mobile: number;
  image: string;
  warehouses: string[];
  loading_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateUserRequestBody
  extends Omit<
    IUser,
    "vendor_id" | "image" | "status" | "created_at" | "updated_at" | "role"
  > {}
