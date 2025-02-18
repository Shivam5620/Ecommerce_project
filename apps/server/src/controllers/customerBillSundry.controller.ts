import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import { APIResponse } from "@repo/ui/dist/types/response";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/customerBillSundry.service";
import {
  ICustomerBillSundry,
  IGetAllCustomerBillSundriesQuery,
} from "@repo/ui/dist/types/customerBillSundry";

export const getAllCustomerBillSundries = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<Array<ICustomerBillSundry>>,
      Record<never, never>,
      IGetAllCustomerBillSundriesQuery,
      Record<string, any>
    >,
    res: Response<APIResponse<Array<ICustomerBillSundry>>, Record<string, any>>,
  ) => {
    const conditions: FilterQuery<ICustomerBillSundry> = {};
    if (req.query.customer_code) {
      conditions.customer_code = req.query.customer_code;
    }

    const discounts = await service.getAllCustomerBillSundries(
      conditions,
      {},
      {
        populate: ["bill_sundry", "customer"],
        sort: { created_at: -1 },
        lean: true,
      },
    );
    const response: APIResponse = {
      status: true,
      data: discounts,
      message: "Customer bill sundries fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const addCustomerBillSundry = asyncHandler(
  async (req: Request, res: Response) => {
    const discount = await service.addCustomerBillSundry(req.body);
    const response: APIResponse = {
      status: true,
      data: discount,
      message: "Customer bill sundry added successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);
