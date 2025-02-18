import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IRole } from "@repo/ui/dist/types/role";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import RoleModel from "../models/role.model";

export const getRoles = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IRole[]>,
      Record<string, never>
    >,
    res: Response<APIResponse<IRole[]>>,
  ) => {
    const role = await RoleModel.find().exec();

    const response: APIResponse<IRole[]> = {
      status: true,
      data: role,
      message: "Roles fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const createRole = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<IRole>, IRole>,
    res: Response<APIResponse<IRole>>,
  ) => {
    const newRole = await RoleModel.create(req.body);

    const response: APIResponse<IRole> = {
      status: true,
      data: newRole,
      message: "Role created successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const updateRole = asyncHandler(
  async (
    req: Request<{ id: string }, APIResponse<IRole>, Partial<IRole>>,
    res: Response<APIResponse<IRole | null>>,
  ) => {
    const { id } = req.params;
    console.log({ id, roleUpdates: req.body });
    const existingRole = await RoleModel.findById(id).exec();
    if (!existingRole) {
      const response: APIResponse<null> = {
        status: false,
        data: null,
        message: "Role not found",
      };
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    const updatedRole = await RoleModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    ).exec();

    if (!updatedRole) {
      const response: APIResponse<null> = {
        status: false,
        data: null,
        message: "Failed to update role",
      };
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
    const response: APIResponse<IRole> = {
      status: true,
      data: updatedRole,
      message: "Role updated successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);
