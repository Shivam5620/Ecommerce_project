import { Schema, model } from "mongoose";
import { ICustomerBillSundry } from "@repo/ui/dist/types/customerBillSundry";
import { CustomerBillSundryType } from "@repo/ui/dist/enums/customerBillSundry";

const customerBillSundrySchema = new Schema<ICustomerBillSundry>(
  {
    bill_sundry_code: { type: String, required: true },
    customer_code: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(CustomerBillSundryType),
      required: true,
    },
    value: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

customerBillSundrySchema.virtual("customer", {
  ref: "Customer",
  localField: "customer_code",
  foreignField: "code",
  justOne: true,
});

customerBillSundrySchema.virtual("bill_sundry", {
  ref: "BillSundry",
  localField: "bill_sundry_code",
  foreignField: "code",
  justOne: true,
});

const CustomerBillSundryModel = model<ICustomerBillSundry>(
  "CustomerBillSundry",
  customerBillSundrySchema,
  "customer_bill_sundries",
);

export default CustomerBillSundryModel;
