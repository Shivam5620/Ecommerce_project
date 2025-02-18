import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/shipment.service";
import { IOrderDispatch } from "@repo/ui/dist/types/orderDispatch";

export const getDispatchesToShip = asyncHandler(
  async (req: Request, res: Response<APIResponse<IOrderDispatch[]>>) => {
    const dispatches = await service.getDispatchesToShip();

    const response: APIResponse<IOrderDispatch[]> = {
      status: true,
      data: dispatches,
      message: "Dispatches fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
