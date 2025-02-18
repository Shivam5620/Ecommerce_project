import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../middlewares/error.middleware";
import UserModel from "../models/user.model";
import { IChangePasswordBody } from "@repo/ui/dist/types/auth";

export const login = async (data: any): Promise<string> => {
  const { email, password } = data;

  let user = await UserModel.findOne({
    email,
  });

  if (!user) throw new AppError(StatusCodes.BAD_REQUEST, `User not found`);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new AppError(StatusCodes.BAD_REQUEST, `Invalid credentials`);

  const payload = {
    user,
  };

  const token = jwt.sign(payload, config.authentication.jwt_secret, {
    expiresIn: "1h",
  });

  return token;
};

export const changePassword = async (
  userId: string,
  data: IChangePasswordBody,
): Promise<void> => {
  const { oldPassword, newPassword } = data;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, `User not found`);
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(StatusCodes.BAD_REQUEST, `Invalid old password`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();
};
