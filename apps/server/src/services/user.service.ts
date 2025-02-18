import { IUser } from "@repo/ui/dist/types/user";
import { AppError } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";

export const addUser = async (data: IUser) => {
  let user = await UserModel.findOne({ email: data.email });
  if (user) throw new AppError(StatusCodes.BAD_REQUEST, `User already exists`);

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(data.password, salt);

  const newUser = new UserModel({ ...data, salt, password });
  await newUser.save();
  return newUser;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return UserModel.find();
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  let user = await UserModel.findById(id);
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, `User not found`);

  if (data.email && data.email !== user.email) {
    const emailExists = await UserModel.findOne({ email: data.email });
    if (emailExists)
      throw new AppError(StatusCodes.BAD_REQUEST, `Email is already in use`);
  }

  if (
    data.password &&
    data.password.length &&
    data.password !== user.password
  ) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  } else {
    delete data.password;
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  );

  if (!updatedUser)
    throw new AppError(StatusCodes.NOT_FOUND, `User could not be updated`);

  return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  await UserModel.findByIdAndDelete(id);
};
