import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IMaterialCenter } from "@repo/ui/dist/types/materialCenter";
import { asyncHandler } from "../middlewares/error.middleware";
import * as materialCenterService from "../services/materialCenter.service";

export const addMaterialCenter = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IMaterialCenter>,
      IMaterialCenter
    >,
    res: Response<APIResponse<IMaterialCenter>>,
  ) => {
    const MaterialCenter = await materialCenterService.addMaterialCenter(
      req.body,
    );

    const response: APIResponse<IMaterialCenter> = {
      status: true,
      data: MaterialCenter,
      message: "MaterialCenter added successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getAllMaterialCenter = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IMaterialCenter[]>,
      Record<never, never>
    >,
    res: Response<APIResponse<IMaterialCenter[]>>,
  ) => {
    const materialCenters = await materialCenterService.getAllMaterialCenter();

    const response: APIResponse<IMaterialCenter[]> = {
      status: true,
      data: materialCenters,
      message: "MaterialCenters fetched.... successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const updateMaterialCenter = asyncHandler(
  async (
    req: Request<
      { id: string },
      APIResponse<IMaterialCenter>,
      Partial<IMaterialCenter>
    >,
    res: Response<APIResponse<IMaterialCenter>>,
  ) => {
    const { id } = req.params;
    const updatedMaterialCenter =
      await materialCenterService.updateMaterialCenter(id, req.body);

    const response: APIResponse<IMaterialCenter> = {
      status: true,
      data: updatedMaterialCenter,
      message: "MaterialCenter updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
