import { StatusCodes } from "http-status-codes";
import { AppError } from "../middlewares/error.middleware";
import CustomerModel from "../models/customer.model";
import * as busyService from "./busy.service";
import {
  IBusyCustomerImportResponse,
  ICustomer,
} from "@repo/ui/dist/types/customer";
import { ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";

export const getAllCustomers = async () => {
  return CustomerModel.find();
};

export const getCustomer = async (
  filter?: RootFilterQuery<ICustomer>,
  projection?: ProjectionType<ICustomer> | null,
  options?: QueryOptions<ICustomer> | null,
) => {
  return CustomerModel.findOne(filter, projection, options);
};

export const importCustomers = async () => {
  try {
    const customers =
      await busyService.fetchData<IBusyCustomerImportResponse>("customers");

    if (customers.length === 0) {
      throw new AppError(StatusCodes.NOT_FOUND, "No customers found to import");
    }

    // Prepare bulk operations
    const bulkOps = customers.map((customer) => ({
      updateOne: {
        filter: { code: customer.Code },
        update: {
          $set: {
            code: customer.Code,
            name: customer.Name,
            alias: customer.Alias,
            mobile_no: customer.Mobile,
            gst_no: customer.GSTNo,
            gst_type: "",
            whatsapp_no: customer.WhatsAppNo,
            print_name: customer.PrintName,
            state: customer.State,
            account_group: customer.AccountGroup,
            account_category: customer.AccountCategory,
            master_notes: customer.MasterNotes,
            hsn_code: customer.HSNCode,
          },
        },
        upsert: true,
      },
    }));

    // Perform bulk write operation
    const result = await CustomerModel.bulkWrite(bulkOps);
    console.log("Bulk operation result:", result);
    return result;
  } catch (error) {
    console.error("Error importing customers:", error);
    throw new Error("Failed to import customers.");
  }
};
