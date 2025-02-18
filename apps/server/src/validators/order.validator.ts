import Joi from "joi";
import {
  ICancelOrdersRequestBody,
  IBatchOrdersRequestBody,
  ICreateOrderItemRequestBody,
  ICreateOrderRequestBody,
  IOrder,
  IOrderItem,
  IGetOrdersQuery,
} from "@repo/ui/dist/types/order";
import { IGetOrderDispatchQuery } from "@repo/ui/dist/types/orderDispatch";

export const addOrderInputSchema = (() => {
  const orderItemSchema = Joi.object<ICreateOrderItemRequestBody>({
    size: Joi.string().required(),
    qty: Joi.number().required(),
    color: Joi.string().required(),
    code: Joi.string().required(),
    comment: Joi.string().required().min(0),
  });

  const schema = Joi.object<ICreateOrderRequestBody>({
    shop_name: Joi.string().required(),
    items: Joi.array().min(1).items(orderItemSchema).required(),
    isd: Joi.number().required(),
    mobile: Joi.number().required(),
    city: Joi.string().required(),
    remark: Joi.string().required().min(0),
  }).required();

  return {
    body: schema,
  };
})();

export const updateOrderInputSchema = (() => {
  const orderItemSchema = Joi.object<IOrderItem>({
    size: Joi.string().required(),
    qty: Joi.number().required(),
    color: Joi.string().required(),
    code: Joi.string().required(),
    comment: Joi.string().allow(null, ""),
  });

  const schema = Joi.object<IOrder>({
    shop_name: Joi.string(),
    items: Joi.array().min(1).items(orderItemSchema),
    isd: Joi.number(),
    mobile: Joi.number(),
    customer_code: Joi.string(),
    city: Joi.string(),
    remark: Joi.string().min(0),
    status: Joi.string(),
    batch_id: Joi.string(),
  });

  return {
    body: schema,
  };
})();

export const cancelOrdersInputSchema = (() => {
  const schema = Joi.object<ICancelOrdersRequestBody>({
    order_ids: Joi.array().items(Joi.string()).min(1).required(),
  }).required();

  return {
    body: schema,
  };
})();

export const batchOrdersInputSchema = (() => {
  const schema = Joi.object<IBatchOrdersRequestBody>({
    order_ids: Joi.array().items(Joi.string()).min(1).required(),
  }).required();

  return {
    body: schema,
  };
})();

export const dispatchOrdersInputSchema = (() => {
  const dispatchItemSchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().required(),
    code: Joi.string().required(),
    size: Joi.string().required(),
    dispatch_qty: Joi.number().required(),
  });

  const schema = Joi.object({
    items: Joi.array().items(dispatchItemSchema).required(),
    remark: Joi.string().min(0).default(""),
    image: Joi.string(),
  }).required();

  return {
    params: {
      id: Joi.string().length(24).hex().required(),
    },
    body: schema,
  };
})();

export const getOrderDispatchInputSchema = (() => {
  return {
    query: Joi.object<IGetOrderDispatchQuery>({
      dispatch_ids: Joi.array().items(Joi.string()),
    }),
  };
})();

export const getOrdersInputSchema = (() => {
  return {
    query: Joi.object<IGetOrdersQuery>({
      search: Joi.string().min(0).default(""),
      select: Joi.string().min(0).default(""),
      date: Joi.date(),
    }).required(),
  };
})();

// export const getPaginatedOrdersInputSchema = (() => {
//   return {
//     query: Joi.object<PaginatedData<IOrder>>({
//       limit: Joi.number().default(10),
//       page: Joi.number().default(1),
//       offset: Joi.number().integer().min(0).optional(),
//     }).required(),
//   };
// })()

export const getPaginatedOrdersInputSchema = (() => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).optional().default(10),
    offset: Joi.number().integer().min(0).optional(),
    search: Joi.string().min(0).optional(),
    select: Joi.string().optional(),
    sortField: Joi.string().optional(),
    sortOrder: Joi.string().optional(),
  });

  return {
    query: schema,
  };
})();
