// import { IGetListInput, IGetPaginatedListInput } from "../../frontend/src/types/paginate";
import Joi from "joi";

// export const vehicleNumberSchema = Joi.string()
//   .pattern(new RegExp("^[A-Z]{2}d{2}[A-Z]{2}d{4}$"))
//   .messages({
//     "string.pattern.base": `Vehicle Number must be in the format XX99XX9999`,
//   });

// export const getListInputSchema = (() => ({
//   query: Joi.object<IGetListInput>({
//     startDate: Joi.date(),
//     endDate: Joi.date(),
//   }),
// }))();

// export const getPaginatedListInputSchema = (() => ({
//   query: Joi.object<IGetPaginatedListInput>({
//     search: Joi.string(),
//     limit: Joi.number().default(10),
//     offset: Joi.number().default(0),
//   }),
// }))();

export const deleteInputSchema = (() => {
  return {
    params: Joi.object({
      id: Joi.string().hex().length(24).required(),
    }),
  };
})();

export const getByIdInputSchema = (() => {
  return {
    params: Joi.object({
      id: Joi.string().hex().length(24).required(),
    }),
  };
})();
