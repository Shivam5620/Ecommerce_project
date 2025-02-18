import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import * as service from "../services/customerBeatSchedule.service";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/dist/types/customerBeatSchedule";

export const createCustomerBeatSchedule = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<Array<ICustomerBeatSchedule>>,
      ICreateCustomerBeatScheduleRequestBody
    >,
    res: Response<APIResponse<Array<ICustomerBeatSchedule>>>,
  ) => {
    const customerBeatSchedules = await service.createCustomerBeatSchedules(
      req.body,
    );
    const response: APIResponse = {
      status: true,
      data: customerBeatSchedules,
      message: "Customer Beat Schedules created successfully.",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getAllCustomerBeatSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeats = await service.getAllCustomerBeatSchedule();
    const response: APIResponse = {
      status: true,
      data: customerBeats,
      message: "Customer beats fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const updateCustomerBeatSchedule = asyncHandler(
  async (
    req: Request<
      { id: string },
      APIResponse<ICustomerBeatSchedule>,
      Partial<ICustomerBeatSchedule>
    >,
    res: Response<APIResponse<ICustomerBeatSchedule>>,
  ) => {
    const customerBeatSchedule = await service.updateCustomerBeatSchedule(
      req.params.id,
      req.body,
    );
    if (!customerBeatSchedule) {
      throw new AppError(StatusCodes.NOT_FOUND, "Customer Beat not found");
    }
    const response: APIResponse = {
      status: true,
      data: customerBeatSchedule,
      message: "Customer beat Schedule updated successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const deleteCustomerBeatSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeatSchedule = await service.deleteCustomerBeatSchedule(
      req.params.id,
    );
    if (!customerBeatSchedule) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "Customer Beat Schedule not found",
      );
    }
    const response: APIResponse = {
      status: true,
      data: customerBeatSchedule,
      message: "Customer Beat Schedule deleted successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);
