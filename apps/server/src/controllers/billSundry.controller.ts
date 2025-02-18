import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import * as service from "../services/billSundry.service";
import { IBillSundry } from "@repo/ui/dist/types/billSundry";

export const getAllBillSundries = asyncHandler(
  async (req: Request, res: Response<APIResponse<Array<IBillSundry>>>) => {
    const result = await service.getAllBillSundries();

    const response: APIResponse<Array<IBillSundry>> = {
      status: true,
      data: result,
      message: "Bill Sundries fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const importBillSundries = asyncHandler(
  async (
    req: Request<Record<never, never>, any, any, Record<never, never>>,
    res: Response,
  ) => {
    const result = await service.importBillSundries();

    const response: APIResponse = {
      status: true,
      data: result,
      message: "Bill Sundries imported successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
