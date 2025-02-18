export interface IOrderTransport {
  _id?: string;
  dispatch_ids: string[];
  driver_name: string;
  vehicle_number: string;
  image: string;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}
