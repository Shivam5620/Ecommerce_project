import { IProduct } from "@repo/ui/dist/types/product";
import { Document, model, Schema } from "mongoose";

export const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    brand: { type: String, required: true },
    item_group: { type: String, default: "" },
    item_group_code: { type: String, default: "" },
    category: { type: [String], required: true },
    MOQ: { type: Number, default: 0 },
    MRP: { type: Number, default: 0 },
    PRCTN: { type: Number, default: 0 },
    rack_no: { type: String, required: true },
    color: { type: String, required: true },
    product_code: { type: String },
    size: { type: String, required: true },
    sale_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    image: { type: String },
    status: { type: Number, enum: [0, 1], default: 1 },
    points: { type: Number, default: 0 },
    ean_code: { type: String, default: "" },
    hsn_code: { type: String, default: "" },
    hasImage: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export interface ProductDocument extends Document {}

const ProductModel = model<IProduct>("Product", productSchema);

export default ProductModel;
