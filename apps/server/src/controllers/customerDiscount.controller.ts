import { APIResponse } from "@repo/ui/dist/types/response";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middlewares/error.middleware";
import { Request, Response } from "express";
import * as service from "../services/customerDiscount.service";
import { FilterQuery } from "mongoose";
import {
  ICustomerDiscount,
  IGetAllCustomerDiscountsQuery,
} from "@repo/ui/dist/types/customerDiscount";

export const getAllCustomerDiscounts = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<Array<ICustomerDiscount>>,
      Record<never, never>,
      IGetAllCustomerDiscountsQuery,
      Record<string, any>
    >,
    res: Response<APIResponse<Array<ICustomerDiscount>>, Record<string, any>>,
  ) => {
    const conditions: FilterQuery<ICustomerDiscount> = {};
    if (req.query.customer_code) {
      conditions.customer_code = req.query.customer_code;
    }

    const discounts = await service.getAllCustomerDiscounts(
      conditions,
      {},
      {
        populate: ["product", "item_group"],
        sort: { created_at: -1 },
        lean: true,
      },
    );
    const response: APIResponse = {
      status: true,
      data: discounts,
      message: "Customer discounts fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const addCustomerDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    const discount = await service.addCustomerDiscount(req.body);
    const response: APIResponse = {
      status: true,
      data: discount,
      message: "Customer discount added successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);

export const deleteCustomerDiscount = asyncHandler(
  async (req: Request, res: Response) => {
    await service.deleteCustomerDiscount(req.params.id);
    const response: APIResponse = {
      status: true,
      data: null,
      message: "Customer discount deleted successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);
