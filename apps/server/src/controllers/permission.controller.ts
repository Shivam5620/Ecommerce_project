import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IPermission } from "@repo/ui/dist/types/permission";
import { asyncHandler } from "../middlewares/error.middleware";
import PermissionModel from "../models/permission.model";

export const createPermission = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<IPermission>, IPermission>,
    res: Response<APIResponse<IPermission>>,
  ) => {
    const permission = await PermissionModel.create(req.body);

    const response: APIResponse<IPermission> = {
      status: true,
      data: permission,
      message: "Permission placed successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getAllPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const permissions = await PermissionModel.find().lean().exec();

    const response: APIResponse<Array<IPermission>> = {
      status: true,
      data: permissions,
      message: "Permissions fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
