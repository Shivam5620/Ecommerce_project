import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { ITransport } from "@repo/ui/dist/types/transport";
import { asyncHandler } from "../middlewares/error.middleware";
import TransportModel from "../models/transport.model";
import multer from "multer";
import { UploadType } from "@repo/ui/dist/enums/upload";
import {
  addTransport,
  getOrdersTransport,
} from "../services/transport.service";

export const transportUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const createTransport = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<any>, any>,
    res: Response<APIResponse<any>>,
  ) => {
    console.log(req.body);

    const transport = await addTransport({
      ...req.body,
      created_by: res.locals.user._id,
      image: req.file ? req.file.filename : null,
    });

    const response: APIResponse<any> = {
      status: true,
      data: transport,
      message: "Transport added successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getOrdersToTransport = asyncHandler(
  async (req: Request, res: Response<APIResponse<any>>) => {
    const orders = await getOrdersTransport();

    const response: APIResponse<any> = {
      status: true,
      data: orders,
      message: "Orders fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
