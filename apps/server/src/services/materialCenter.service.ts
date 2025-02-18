import { IMaterialCenter } from "@repo/ui/dist/types/materialCenter";
import { AppError } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import MaterialCenterModel from "../models/materialCenter.model";

export const addMaterialCenter = async (data: IMaterialCenter) => {
  let materialCenterModel = await MaterialCenterModel.findOne({
    name: data.name,
  });
  if (materialCenterModel)
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `MaterialCenter already exists`,
    );
  const newMaterialCenter = new MaterialCenterModel(data);
  await newMaterialCenter.save();
  return newMaterialCenter;
};

export const getAllMaterialCenter = async (): Promise<IMaterialCenter[]> => {
  return MaterialCenterModel.find();
};

export const updateMaterialCenter = async (
  id: string,
  data: Partial<IMaterialCenter>,
): Promise<IMaterialCenter> => {
  let materialCenter = await MaterialCenterModel.findById(id);
  if (!materialCenter)
    throw new AppError(StatusCodes.NOT_FOUND, `MaterialCenter not found`);
  const updateMaterialCenter = await MaterialCenterModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  );
  if (!updateMaterialCenter)
    throw new AppError(
      StatusCodes.NOT_FOUND,
      `MaterialCenter could not be updated`,
    );

  return updateMaterialCenter;
};
