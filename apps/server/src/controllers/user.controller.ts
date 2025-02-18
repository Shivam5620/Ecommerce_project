import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IUser } from "@repo/ui/dist/types/user";
import { asyncHandler } from "../middlewares/error.middleware";
import * as userService from "../services/user.service";

export const addUser = asyncHandler(
  async (
    req: Request<Record<never, never>, APIResponse<IUser>, IUser>,
    res: Response<APIResponse<IUser>>,
  ) => {
    const order = await userService.addUser(req.body);

    const response: APIResponse<IUser> = {
      status: true,
      data: order,
      message: "User added successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

export const getAllUsers = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<IUser[]>,
      Record<never, never>
    >,
    res: Response<APIResponse<IUser[]>>,
  ) => {
    const users = await userService.getAllUsers();

    const response: APIResponse<IUser[]> = {
      status: true,
      data: users,
      message: "Users fetched",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const updateUser = asyncHandler(
  async (
    req: Request<{ id: string }, APIResponse<IUser>, Partial<IUser>>,
    res: Response<APIResponse<IUser>>,
  ) => {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);

    const response: APIResponse<IUser> = {
      status: true,
      data: updatedUser,
      message: "User updated successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const deleteUser = asyncHandler(
  async (
    req: Request<{ id: string }, APIResponse<null>, Record<never, never>>,
    res: Response<APIResponse<null>>,
  ) => {
    const { id } = req.params;
    await userService.deleteUser(id);

    const response: APIResponse<null> = {
      status: true,
      data: null,
      message: "User deleted successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);
