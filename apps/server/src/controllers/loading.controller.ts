import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { ILoading } from "@repo/ui/dist/types/loading";
import { asyncHandler } from "../middlewares/error.middleware";
import LoadingModel from "../models/loading.model";
import { getNextSequenceWithPrefix } from "../services/counter.service";
import { CounterType } from "@repo/ui/dist/enums/counter";

export const addLoading = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<ILoading>, ILoading>,
    res: Response<APIResponse<ILoading>>,
  ) => {
    const loading = new LoadingModel(req.body);
    const loadingId = await getNextSequenceWithPrefix(
      CounterType.LOADING,
      "LD-",
    );
    loading.loading_id = loadingId;
    await loading.save();

    const response: APIResponse<ILoading> = {
      status: true,
      data: loading,
      message: "Loading added successfully",
    };
    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getAllLoadings = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<ILoading[]>,
      Record<never, never>
    >,
    res: Response<APIResponse<ILoading[]>>,
  ) => {
    const loadings = await LoadingModel.find();

    const response: APIResponse<ILoading[]> = {
      status: true,
      data: loadings,
      message: "Loadings fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const updateLoading = asyncHandler(
  async (
    req: Request<
      { id: string },
      APIResponse<ILoading | null>,
      Partial<ILoading>
    >,
    res: Response<APIResponse<ILoading | null>>,
  ) => {
    const { id } = req.params;
    const updatedLoading = await LoadingModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedLoading) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        data: null,
        message: "Loading not found",
      });
    }

    const response: APIResponse<ILoading> = {
      status: true,
      data: updatedLoading,
      message: "Loading updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
