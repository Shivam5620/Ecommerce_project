import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { asyncHandler } from "../middlewares/error.middleware";
import multer from "multer";
import { IOrderDispatch } from "@repo/ui/dist/types/orderDispatch";
import * as service from "../services/orderLoad.service";
import {
  ICreateOrderLoadRequestBody,
  IOrderLoad,
} from "@repo/ui/dist/types/orderLoad";

export const orderLoadUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const createOrderLoad = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IOrderLoad>,
      ICreateOrderLoadRequestBody
    >,
    res: Response<APIResponse<IOrderLoad>>,
  ) => {
    const orderLoad = await service.addOrderLoad({
      ...req.body,
      created_by: res.locals.user._id,
      image: req.file ? req.file.filename : null,
    });

    const response: APIResponse<any> = {
      status: true,
      data: orderLoad,
      message: "Order Loading added successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getDispatchesToLoad = asyncHandler(
  async (req: Request, res: Response<APIResponse<IOrderDispatch[]>>) => {
    const dispatches = await service.getDispatchesToLoad();

    const response: APIResponse<any> = {
      status: true,
      data: dispatches,
      message: "Dispatches fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
