import mongoose, { model, Schema } from "mongoose";
import { IBrand } from "@repo/ui/dist/types/brand";

const brandSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface BrandDocument extends Document {
  // , Omit<IBrand, "_id">
}
const BrandModel = model<IBrand>("Brand", brandSchema);

export default BrandModel;
