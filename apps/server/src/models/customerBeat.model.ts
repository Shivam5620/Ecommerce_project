import mongoose, { Schema, Document } from "mongoose";
import { ICustomerBeat } from "@repo/ui/dist/types/customerBeat";

const customerBeatSchema: Schema = new Schema<ICustomerBeat>(
  {
    name: {
      type: String,
      required: true,
    },
    customer_codes: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

customerBeatSchema.virtual("customers", {
  ref: "Customer",
  localField: "customer_codes",
  foreignField: "code",
  justOne: false,
});

const CustomerBeatModel = mongoose.model<ICustomerBeat>(
  "CustomerBeat",
  customerBeatSchema,
  "customer_beats",
);

export default CustomerBeatModel;
