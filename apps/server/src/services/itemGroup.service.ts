import { StatusCodes } from "http-status-codes";
import { AppError } from "../middlewares/error.middleware";
import * as busyService from "./busy.service";
import { IBusyItemGroupImportResponse } from "@repo/ui/dist/types/itemGroup";
import logger from "../utils/logger";
import ItemGroupModel from "../models/itemGroup.model";

export const getAllItemGroups = async () => {
  return ItemGroupModel.find();
};

export const importItemGroups = async () => {
  const itemGroups =
    await busyService.fetchData<IBusyItemGroupImportResponse>("itemGroups");

  if (itemGroups.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No item groups found to import");
  }

  logger.info(`Importing ${itemGroups.length} item groups`);
  console.log(itemGroups);

  // Remove the existing item groups
  await ItemGroupModel.deleteMany({});

  const newItemGroups = itemGroups.map(
    (itemGroup) =>
      new ItemGroupModel({
        name: itemGroup.Name,
        code: itemGroup.Code,
      }),
  );

  const result = await ItemGroupModel.insertMany(newItemGroups);
  return result;
};
