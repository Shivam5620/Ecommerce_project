import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/bilty.service";
import multer from "multer";
import { IOrderDispatch } from "@repo/ui/dist/types/orderDispatch";
import {
  ICreateBiltyRequestBody,
  IGetDispatchesByTransportDateQuery,
} from "@repo/ui/dist/types/bilty";
import OrderDispatchModel from "../models/orderDispatch.model";
import BiltyModel from "../models/bilty.model";

export const biltyUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const addBilty = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse,
      ICreateBiltyRequestBody,
      Record<never, never>
    >,
    res: Response<APIResponse>,
  ) => {
    req.body.image = req.file?.filename ?? "";
    const user = res.locals.user;
    const bilty = await service.addBilty(req.body, user._id);

    const response: APIResponse = {
      status: true,
      data: bilty,
      message: "Bilty image uploaded and dispatch updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getBiltys = asyncHandler(async (req: Request, res: Response) => {
  const biltys = await service.fetchBiltys();

  const response: APIResponse = {
    status: true,
    data: biltys,
    message: "Biltys fetched successfully",
  };

  res.status(StatusCodes.OK).json(response);
});

export const getDispatchesByTransportAndDate = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrderDispatch[]>,
      Record<never, never>,
      IGetDispatchesByTransportDateQuery
    >,
    res: Response<APIResponse<IOrderDispatch[]>>,
  ) => {
    const { vehicle_number, date } = req.query;

    const dispatches = await service.fetchDispatchesByTransportNumberAndDate(
      vehicle_number,
      date,
    );

    const response: APIResponse = {
      status: true,
      data: dispatches,
      message: "Dispatches fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
