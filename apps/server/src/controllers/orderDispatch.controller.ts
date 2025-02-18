import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/orderDispatch.service";
import {
  IOrderDispatch,
  IPaginatedOrderDispatchQuery,
} from "@repo/ui/dist/types/orderDispatch";
import { PaginateResult } from "mongoose";
import { IGetOrdersQuery, IOrder } from "@repo/ui/dist/types/order";
import { UserType } from "@repo/ui/dist/enums/user";
import { OrderStatus } from "@repo/ui/dist/enums/order";
import OrderModel from "../models/order.model";

export const getOrdersToDispatch = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrder[]>,
      Record<never, never>,
      IGetOrdersQuery
    >,
    res: Response<APIResponse<IOrder[]>, Record<string, any>>,
  ) => {
    const { user } = res.locals;

    let orders: IOrder[] = [];
    switch (user.type) {
      case UserType.PACKAGER:
        orders = await OrderModel.find({
          status: {
            $in: [
              OrderStatus.BATCHED,
              OrderStatus.UNDER_DISPATCH,
              OrderStatus.PARTIAL_DISPATCH,
              OrderStatus.UNDER_PACK,
            ],
          },
        })
          .populate("dispatches")
          .lean()
          .exec();

        orders = orders.filter((order) => {
          return order.dispatches?.some(
            (dispatch) => dispatch.dispatched_by === UserType.PACKAGER,
          )
            ? false
            : true;
        });

        break;

      case UserType.WAREHOUSEMANAGER:
        // Return only the orders with status batched and has some items with the warehouse assigned to them
        orders = await OrderModel.find({
          status: {
            $in: [
              OrderStatus.BATCHED,
              OrderStatus.UNDER_DISPATCH,
              OrderStatus.PARTIAL_DISPATCH,
            ],
          },
          "items.product_details.rack_no": { $in: user.warehouses },
        })
          .populate("dispatches")
          .sort({ created_at: -1 })
          .lean()
          .exec();

        orders.forEach((order) => {
          console.log(order.dispatches);
        });
        orders = orders.filter((order) => {
          return order.dispatches?.some(
            (dispatch) =>
              dispatch.dispatched_by === UserType.PACKAGER ||
              dispatch.created_by.toString() === String(user._id),
          )
            ? false
            : true;
        });

        break;
      default:
        break;
    }

    const response: APIResponse<Array<IOrder>> = {
      status: true,
      data: orders,
      message: "Orders fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getOrderDispatches = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrderDispatch[]>,
      Record<never, never>
    >,
    res: Response<APIResponse<IOrderDispatch[]>>,
  ) => {
    const dispatches = await service.getOrderDispatches(req.query);

    const response: APIResponse<IOrderDispatch[]> = {
      status: true,
      data: dispatches,
      message: "Dispatches fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getOrderDispatchById = asyncHandler(
  async (
    req: Request<
      { id: string },
      APIResponse<IOrderDispatch | null>,
      Record<never, never>
    >,
    res: Response<APIResponse<IOrderDispatch | null>>,
  ) => {
    const { id } = req.params;
    const dispatch = await service.getOrderDispatchById(id);

    if (!dispatch) {
      const response: APIResponse<null> = {
        status: false,
        data: null,
        message: "Dispatch not found",
      };

      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    const response: APIResponse<IOrderDispatch> = {
      status: true,
      data: dispatch,
      message: "Dispatch fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getDispatchesForWPWithPagination = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<PaginateResult<IOrderDispatch>>,
      Record<never, never>,
      IPaginatedOrderDispatchQuery
    >,
    res: Response<APIResponse>,
  ) => {
    const dispatches = await service.getDispatchesForWPWithPagination(
      res.locals.user._id,
      req.query,
    );

    res.status(StatusCodes.OK).json({
      status: true,
      data: dispatches,
      message: "Dispatches with pagination fetched successfully",
    });
  },
);

export const updateDispatch = asyncHandler(
  async (
    req: Request<
      { id: string },
      APIResponse<any>,
      Partial<{ cartons: number; open_boxes: number }>
    >,
    res: Response<APIResponse<any>>,
  ) => {
    const { id } = req.params;
    const { cartons, open_boxes } = req.body as {
      cartons: number;
      open_boxes: number;
    };

    const updatedDispatch = await service.updateDispatchById(
      id,
      cartons,
      open_boxes,
    );

    const response: APIResponse<unknown> = {
      status: true,
      data: updatedDispatch,
      message: "Dispatch updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const syncInvoices = asyncHandler(
  async (req: Request, res: Response) => {
    const syncedInvoices = await service.syncSalesInvoices();

    const response: APIResponse = {
      status: true,
      data: {
        invoiceIds: syncedInvoices.join(", "),
      },
      message: `Synced ${syncedInvoices.length} invoices successfully`,
    };

    if (syncedInvoices.length === 0) {
      response.status = false;
      response.message = "No invoices synced";
      return res.status(StatusCodes.OK).json(response);
    }

    res.status(StatusCodes.OK).json(response);
  },
);
