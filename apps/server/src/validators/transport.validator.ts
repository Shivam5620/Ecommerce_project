import Joi from "joi";
import { ITransport } from "@repo/ui/dist/types/transport";

export const createTransportInputSchema = (() => {
  const schema = Joi.object<ITransport>({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    gst: Joi.string().required(),
    remark: Joi.string().required(),
  }).required();

  return {
    body: schema,
  };
})();
