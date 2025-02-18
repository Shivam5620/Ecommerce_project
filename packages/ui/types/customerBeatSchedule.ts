import { ICustomerBeat } from "./customerBeat";
import { IUser } from "./user";

export interface ICustomerBeatSchedule {
  _id: string;
  customer_beat_id: string;
  user_id: string;
  date: string;
  created_at?: Date;
  updated_at?: Date;

  // Virtuals
  customer_beat?: ICustomerBeat;
  user?: IUser;
}

export interface ICreateCustomerBeatScheduleRequestBody {
  user_id: string;
  schedules: Array<{
    customer_beat_id: string;
    date: string;
  }>;
}
