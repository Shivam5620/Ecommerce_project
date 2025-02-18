import { Request, Response } from "express";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import * as service from "../services/customerBeat.service";

// Create Customer Beat
export const createCustomerBeat = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeat = await service.createCustomerBeat(req.body);
    const response: APIResponse = {
      status: true,
      data: customerBeat,
      message: "Customer beat created successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);

// Get All Customer Beats
export const getAllCustomerBeats = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeats = await service.getAllCustomerBeats();
    const response: APIResponse = {
      status: true,
      data: customerBeats,
      message: "Customer beats fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

// Get Customer Beat by ID
export const getCustomerBeatById = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeat = await service.getCustomerBeatById(req.params.id);
    if (!customerBeat) {
      throw new AppError(StatusCodes.NOT_FOUND, "Customer Beat not found");
    }
    const response: APIResponse = {
      status: true,
      data: customerBeat,
      message: "Customer beat fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

// Update Customer Beat
export const updateCustomerBeat = asyncHandler(
  async (req: Request, res: Response) => {
    const customerBeat = await service.updateCustomerBeat(
      req.params.id,
      req.body,
    );
    if (!customerBeat) {
      throw new AppError(StatusCodes.NOT_FOUND, "Customer Beat not found");
    }
    const response: APIResponse = {
      status: true,
      data: customerBeat,
      message: "Customer beat updated successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);
