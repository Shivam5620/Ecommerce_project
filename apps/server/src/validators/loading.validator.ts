import Joi from "joi";
import { ILoading } from "@repo/ui/dist/types/loading";

export const createLoadingInputSchema = (() => {
  return {
    body: Joi.object<ILoading>({
      driver_name: Joi.string().required(),
      vehicle_number: Joi.string().required(),
      mobile: Joi.string().required(),
    }).required(),
  };
})();

export const updateLoadingInputSchema = (() => {
  return {
    params: {
      id: Joi.string().hex().length(24).required(),
    },
    body: Joi.object<Partial<ILoading>>({
      driver_name: Joi.string(),
      vehicle_number: Joi.string(),
      mobile: Joi.string(),
    }).required(),
  };
})();
