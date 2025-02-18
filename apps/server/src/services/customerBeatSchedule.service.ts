import CustomerBeatScheduleModel from "../models/customerBeatSchedule.model";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/dist/types/customerBeatSchedule";

export const createCustomerBeatSchedules = async (
  data: ICreateCustomerBeatScheduleRequestBody,
): Promise<ICustomerBeatSchedule[]> => {
  const customerBeatSchedules = data.schedules.map(
    (schedule) =>
      new CustomerBeatScheduleModel({
        user_id: data.user_id,
        customer_beat_id: schedule.customer_beat_id,
        date: schedule.date,
      }),
  );
  await CustomerBeatScheduleModel.bulkSave(customerBeatSchedules);
  return CustomerBeatScheduleModel.populate(customerBeatSchedules, [
    { path: "user", select: "name" },
    { path: "customer_beat", select: "name" },
  ]);
};

export const getAllCustomerBeatSchedule = async () => {
  return CustomerBeatScheduleModel.find().populate([
    {
      path: "user",
      select: "name",
    },
    {
      path: "customer_beat",
      select: "name",
    },
  ]);
};

export const updateCustomerBeatSchedule = async (
  id: string,
  data: Partial<ICustomerBeatSchedule>,
): Promise<ICustomerBeatSchedule | null> => {
  return CustomerBeatScheduleModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCustomerBeatSchedule = (
  id: string,
): Promise<ICustomerBeatSchedule | null> => {
  return CustomerBeatScheduleModel.findByIdAndDelete(id);
};
