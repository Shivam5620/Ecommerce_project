import Joi from "joi";
import {
  ICreateBiltyRequestBody,
  IGetDispatchesByTransportDateQuery,
} from "@repo/ui/dist/types/bilty";

export const addBiltySchema = (() => {
  const schema = Joi.object<ICreateBiltyRequestBody>({
    dispatch_id: Joi.string().hex().length(24).required(),
    image: Joi.string().optional(),
  }).required();

  return {
    body: schema,
  };
})();

export const getDispatchesByTransportDateInputSchema = (() => {
  return {
    query: Joi.object<IGetDispatchesByTransportDateQuery>({
      vehicle_number: Joi.string().required(),
      date: Joi.date().required(),
    }).required(),
  };
})();
