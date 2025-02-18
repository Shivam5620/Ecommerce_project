import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/customer.service";
import { APIResponse } from "@repo/ui/dist/types/response";

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const customers = await service.getAllCustomers();
    const response: APIResponse = {
      status: true,
      data: customers,
      message: "Customers fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const importCustomers = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<any>>,
    res: Response<APIResponse<any>>,
  ) => {
    const customers = await service.importCustomers();

    const response: APIResponse = {
      status: true,
      data: customers,
      message: "Customers imported successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);
