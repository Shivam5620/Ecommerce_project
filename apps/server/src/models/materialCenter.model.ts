import { Document, model, Schema } from "mongoose";
import { IMaterialCenter } from "@repo/ui/dist/types/materialCenter";

const materialCenterSchema = new Schema<IMaterialCenter>(
  {
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export interface IMaterialCenterDocument extends Document {}

const MaterialCenterModel = model<IMaterialCenter>(
  "MaterialCenter",
  materialCenterSchema,
);

export default MaterialCenterModel;
