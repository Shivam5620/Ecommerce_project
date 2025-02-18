import { Schema, model } from "mongoose";
import { ILoading } from "@repo/ui/dist/types/loading";

const loadingSchema = new Schema<ILoading>(
  {
    loading_id: { type: String, required: true, unique: true },
    driver_name: { type: String, required: true },
    vehicle_number: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export interface LoadingDocument extends Document {}

const LoadingModel = model<ILoading>("Loading", loadingSchema);

export default LoadingModel;
