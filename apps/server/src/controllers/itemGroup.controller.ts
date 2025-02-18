import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import * as service from "../services/itemGroup.service";
import { IItemGroup } from "@repo/ui/dist/types/itemGroup";

export const getAllItemGroups = asyncHandler(
  async (req: Request, res: Response<APIResponse<Array<IItemGroup>>>) => {
    const result = await service.getAllItemGroups();

    const response: APIResponse<Array<IItemGroup>> = {
      status: true,
      data: result,
      message: "Item Groups fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const importItemGroups = asyncHandler(
  async (
    req: Request<Record<never, never>, any, any, Record<never, never>>,
    res: Response,
  ) => {
    const result = await service.importItemGroups();

    const response: APIResponse = {
      status: true,
      data: result,
      message: "Item Groups imported successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
