import Joi from "joi";

export const addOrderBatchInputSchema = (() => {
  const schema = Joi.object({
    orderIds: Joi.array()
      .items(Joi.string().hex().length(24).required())
      .required(),
  }).required();

  return {
    body: schema,
  };
})();
