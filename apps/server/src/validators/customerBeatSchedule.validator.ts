import Joi from "joi";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/dist/types/customerBeatSchedule";

export const addCustomerBeatScheduleInputSchema = Joi.object({
  body: Joi.object<ICreateCustomerBeatScheduleRequestBody>({
    user_id: Joi.string().hex().required(),
    schedules: Joi.array()
      .items(
        Joi.object({
          customer_beat_id: Joi.string().hex().length(24).required(),
          date: Joi.date().iso().required(),
        }),
      )
      .required(),
  }),
});

export const updateCustomerBeatScheduleInputSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object<ICustomerBeatSchedule>({
    user_id: Joi.string().hex().length(24).optional(),
    customer_beat_id: Joi.string().hex().length(24).optional(),
    date: Joi.date().optional(),
  }),
});
