import Joi from "joi";
import { IOrderLoad } from "@repo/ui/dist/types/orderLoad";

export const createOrderLoadInputSchema = (() => {
  const schema = Joi.object<IOrderLoad>({
    dispatch_ids: Joi.array().items(Joi.string().hex().length(24)).required(),
    loading_id: Joi.string().hex().length(24).required(),
    image: Joi.string(),
  }).required();

  return {
    body: schema,
  };
})();
