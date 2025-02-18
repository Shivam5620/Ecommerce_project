export interface ILoading {
  _id?: string;
  loading_id: string;
  driver_name: string;
  vehicle_number: string;
  mobile: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateLoadingRequestBody
  extends Omit<ILoading, "loading_id" | "created_at" | "updated_at"> {}
