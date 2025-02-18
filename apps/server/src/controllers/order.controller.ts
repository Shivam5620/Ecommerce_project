import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserType } from "@repo/ui/dist/enums/user";
import OrderModel from "../models/order.model";
import {
  ICreateOrderRequestBody,
  IOrder,
  IBatchOrdersRequestBody,
  ICancelOrdersRequestBody,
  IGetOrdersQuery,
  IGetPaginatedOrdersQuery,
} from "@repo/ui/dist/types/order";
import { APIResponse } from "@repo/ui/dist/types/response";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/order.service";
import { IUser } from "@repo/ui/dist/types/user";
import OrderDispatchModel from "../models/orderDispatch.model";
import mongoose from "mongoose";
import multer from "multer";
import {
  IOrderDispatch,
  IOrderDispatchItem,
} from "@repo/ui/dist/types/orderDispatch";
import * as dispatchService from "../services/orderDispatch.service";
import { PaginatedData } from "@repo/ui/dist/types/paginate";

export const dispatchUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const addOrder = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrder>,
      ICreateOrderRequestBody
    >,
    res: Response<APIResponse<IOrder>>,
  ) => {
    const order = await service.addOrder(req.body);

    const response: APIResponse<IOrder> = {
      status: true,
      data: order,
      message: "Order placed successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const updateOrder = asyncHandler(
  async (
    req: Request<{ id: string }, APIResponse<IOrder>>,
    res: Response<APIResponse<IOrder | null>>,
  ) => {
    const { id } = req.params;

    const updatedOrder = await service.updateOrder(id, req.body);
    if (!updatedOrder) {
      throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
    }

    const response: APIResponse<IOrder> = {
      status: true,
      data: updatedOrder as IOrder,
      message: "Order updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const dispatchOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const user: IUser = res.locals.user;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return new AppError(StatusCodes.NOT_FOUND, "Order not found");
    }

    // Validate if user has already dispatched the order
    const dispatchExists = await OrderDispatchModel.exists({
      order_id: new mongoose.Types.ObjectId(orderId),
      created_by: new mongoose.Types.ObjectId(user._id),
    });

    if (dispatchExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        data: null,
        message: "Order already dispatched",
      });
    }

    let inputName = "";
    if (user.type === UserType.WAREHOUSEMANAGER) {
      inputName = "dispatch_qty";
    } else if (user.type === UserType.PACKAGER) {
      inputName = "pack_qty";
    } else {
      return new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized request");
    }

    const data = req.body;
    data.items = data.items.filter(
      (item: IOrderDispatchItem) => item.dispatch_qty != 0,
    );

    const qtyMapper: any = {};
    let dispatchItemsCount = 0;
    data.items.forEach((item: IOrderDispatchItem) => {
      const { code, color, size, dispatch_qty } = item;
      if (!qtyMapper[code]) qtyMapper[code] = {};
      if (!qtyMapper[code][color]) qtyMapper[code][color] = {};
      qtyMapper[code][color][size] = dispatch_qty;
      if (typeof dispatch_qty === "string") {
        dispatchItemsCount += parseInt(dispatch_qty, 10);
      } else {
        dispatchItemsCount += dispatch_qty;
      }
    });

    const updateArr: any = { $inc: {} };
    order.items.forEach((orderItem, index) => {
      const { code, color, size } = orderItem;
      if (qtyMapper[code]?.[color]?.[size]) {
        if (!updateArr["$inc"]) updateArr["$inc"] = {};
        updateArr["$inc"][`items.${index}.${inputName}`] =
          qtyMapper[code][color][size];
      }
    });

    const dispatch = await dispatchService.addOrderDispatch({
      order_id: orderId,
      items: data.items,
      remark: data.remark || "",
      image: req.file ? req.file.filename : null,
      created_by: String(user._id),
      dispatched_by: user.type,
    });

    await dispatch.save();

    if (Object.values(updateArr["$inc"]).length) {
      await OrderModel.updateOne(
        { _id: new mongoose.Types.ObjectId(orderId) },
        updateArr,
      );
    }

    await service.setOrderStatuses({
      _id: new mongoose.Types.ObjectId(orderId),
    });

    const response: APIResponse<IOrderDispatch> = {
      status: true,
      message: `Order Dispatched Successfully. ${dispatch.dispatch_id} ${order.shop_name}, ${order.city} ${dispatchItemsCount} PAIRS.`,
      data: dispatch,
    };
    return res.status(StatusCodes.OK).json(response);
  },
);

export const getAllOrders = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrder[]>,
      Record<never, never>,
      IGetOrdersQuery
    >,
    res: Response<APIResponse<IOrder[]>, Record<string, any>>,
  ) => {
    // Return all orders if user is superadmin
    let orders: IOrder[] = await service.getAllOrders(req.query);

    const response: APIResponse<Array<IOrder>> = {
      status: true,
      data: orders,
      message: "Orders fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const cancelOrders = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse, ICancelOrdersRequestBody>,
    res: Response<APIResponse>,
  ) => {
    const { order_ids } = req.body;

    const updatedOrders = await service.cancelOrders(order_ids);

    const response: APIResponse = {
      status: true,
      data: updatedOrders,
      message: `Orders cancelled successfully`,
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const batchOrders = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrder>,
      IBatchOrdersRequestBody
    >,
    res: Response,
  ) => {
    const { order_ids } = req.body;

    const updatedOrders = await service.batchOrders(order_ids);

    const response: APIResponse<IOrder[]> = {
      status: true,
      data: updatedOrders,
      message: "Orders batched successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const setOrderStatuses = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedOrders = await service.setOrderStatuses();

    const response: APIResponse = {
      status: true,
      data: updatedOrders,
      message: "Orders status updated successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    console.log("Order ID:", id);

    const order = await service.getOrderById(id);

    return res.status(200).json({
      status: true,
      data: order,
      message: "Dispatch logs fetched successfully",
    });
  },
);

export const getPaginatedOrders = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<PaginatedData<IOrder>>,
      Record<never, never>,
      IGetPaginatedOrdersQuery
    >,
    res: Response<APIResponse<PaginatedData<IOrder>>, Record<string, any>>,
  ) => {
    const data = await service.getPaginatedOrders(req.query);

    const response: APIResponse<PaginatedData<IOrder>> = {
      status: true,
      data,
      message: "Orders fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
