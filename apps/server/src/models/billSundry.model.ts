import { Schema, model } from "mongoose";
import { IBillSundry } from "@repo/ui/dist/types/billSundry";

const billSundrySchema = new Schema<IBillSundry>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const BillSundryModel = model<IBillSundry>(
  "BillSundry",
  billSundrySchema,
  "bill_sundries",
);

export default BillSundryModel;
