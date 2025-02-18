import { Schema, model } from "mongoose";
import { CustomerDiscountType } from "@repo/ui/dist/enums/customerDiscount";
import { ICustomerDiscount } from "@repo/ui/dist/types/customerDiscount";

const customerDiscountSchema = new Schema<ICustomerDiscount>(
  {
    item_group_code: { type: String, required: true },
    customer_code: { type: String, required: true },
    product_code: { type: String, default: null },
    discount_1: { type: Number, required: true, default: 0 },
    discount_2: { type: Number, required: true, default: 0 },
    discount_3: { type: Number, required: true, default: 0 },
    type: {
      type: String,
      enum: Object.values(CustomerDiscountType),
      required: true,
    },
    comment: { type: String, default: "" },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

customerDiscountSchema.virtual("product", {
  ref: "Product",
  localField: "product_code",
  foreignField: "product_code",
  justOne: true,
});

customerDiscountSchema.virtual("item_group", {
  ref: "ItemGroup",
  localField: "item_group_code",
  foreignField: "code",
  justOne: true,
});

const CustomerDiscountModel = model<ICustomerDiscount>(
  "CustomerDiscount",
  customerDiscountSchema,
  "customer_discounts",
);

export default CustomerDiscountModel;
