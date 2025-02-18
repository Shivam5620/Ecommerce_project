import { StatusCodes } from "http-status-codes";
import { AppError } from "../middlewares/error.middleware";
import * as busyService from "./busy.service";
import logger from "../utils/logger";
import BillSundryModel from "../models/billSundry.model";
import { IBusyBillSundryImportResponse } from "@repo/ui/dist/types/billSundry";

export const getAllBillSundries = async () => {
  return BillSundryModel.find();
};

export const importBillSundries = async () => {
  const data =
    await busyService.fetchData<IBusyBillSundryImportResponse>("billSundries");

  if (data.length === 0) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "No bill sundries found to import",
    );
  }

  logger.info(`Importing ${data.length} bill sundries`);
  console.log(data);

  // Remove the existing bill sundries
  await BillSundryModel.deleteMany({});

  const newBillSundries = data.map(
    (e) =>
      new BillSundryModel({
        name: e.Name,
        code: e.Code,
      }),
  );

  const result = await BillSundryModel.insertMany(newBillSundries);
  return result;
};
