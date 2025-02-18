import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { AppError, asyncHandler } from "../middlewares/error.middleware";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import { ILoginBody, IChangePasswordBody } from "@repo/ui/dist/types/auth";
import { createToken, jwtMaxAge } from "../utils/auth";
import * as service from "../services/auth.service";

export const login = asyncHandler(
  async (
    req: Request<Record<string, never>, APIResponse, ILoginBody>,
    res: Response,
  ) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email })
      .populate("role")
      .lean()
      .exec();

    if (!user) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User not found with email");
    }

    if (user.status === false) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User Inactive");
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect password");
    }

    const token = createToken(user._id?.toString() ?? "");
    res.cookie("jwt", token, { httpOnly: true, maxAge: jwtMaxAge * 1000 });

    const response: APIResponse = {
      status: true,
      data: user,
      message: "Logged in successfully",
    };

    return res.status(StatusCodes.OK).json(response);
  },
);

export const logout = asyncHandler(
  async (req: Request<Record<string, never>, APIResponse>, res: Response) => {
    res.clearCookie("jwt");
    const response: APIResponse = {
      status: true,
      data: null,
      message: "Logged out successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const changePassword = async (
  req: Request<Record<string, never>, APIResponse, IChangePasswordBody>,
  res: Response,
) => {
  const userId = res.locals.user._id;
  await service.changePassword(userId, req.body);

  const response: APIResponse = {
    status: true,
    data: null,
    message: "Password changed successfully",
  };

  return res.status(StatusCodes.OK).json(response);
};
