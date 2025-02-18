import { model, Schema } from "mongoose";
import { ICustomer } from "@repo/ui/dist/types/customer";

const customerSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: false, default: "" },
    alias: { type: String, required: false, default: "" },
    mobile_no: { type: String, required: false, default: "" },
    gst_no: { type: String, required: false, default: "" },
    gst_type: { type: String, required: false, default: "" },
    whatsapp_no: { type: String, required: false, default: "" },
    print_name: { type: String, required: false, default: "" },
    state: { type: String, required: false, default: "" },
    account_group: { type: String, required: false, default: "" },
    account_category: { type: String, required: false, default: "" },
    master_notes: { type: String, required: false, default: "" },
    approval_status: { type: Boolean, required: false, default: false },
    hsn: { type: String, required: false, default: "" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export interface customerDocument extends Document {
  // , Omit<IBrand, "_id">
}
const CustomerModel = model<ICustomer>("Customer", customerSchema);

export default CustomerModel;
