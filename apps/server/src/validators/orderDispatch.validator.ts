import { IPaginatedOrderDispatchQuery } from "@repo/ui/dist/types/orderDispatch";
import Joi from "joi";

export const getPaginatedOrderDispatchLogsInputSchema = (() => {
  return {
    query: Joi.object<IPaginatedOrderDispatchQuery>({
      limit: Joi.number().default(10),
      page: Joi.number().default(1),
      search: Joi.string().min(0).default(""),
      date: Joi.date(),
    }).required(),
  };
})();
