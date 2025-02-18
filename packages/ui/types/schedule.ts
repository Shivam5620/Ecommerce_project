export interface ICustomerBeatSchedule {
  _id: string;
  date: string;
  user: [];
  beatName: string;
  customer_codes?: string[];
  created_at: Date;
}
