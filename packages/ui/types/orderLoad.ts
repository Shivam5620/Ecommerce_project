import { IOrderDispatch } from "./orderDispatch";

export interface IOrderLoad {
  _id?: string;
  dispatch_ids: string[];
  loading_id: string;
  dispatches?: IOrderDispatch[];
  image: string;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateOrderLoadRequestBody
  extends Pick<IOrderLoad, "loading_id" | "image" | "dispatch_ids"> {}
