import { model, PaginateModel, Schema } from "mongoose";
import { UserType } from "@repo/ui/dist/enums/user";
import {
  IOrderDispatch,
  IOrderDispatchItem,
} from "@repo/ui/dist/types/orderDispatch";
import { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

const dispatchItemSchema = new Schema<IOrderDispatchItem>({
  name: { type: String, required: true },
  color: { type: String, required: true },
  code: { type: String, required: true },
  size: { type: String, required: true },
  dispatch_qty: { type: Number, required: true },
  // total: { type: Number, required: true, default: 0 },
  // cgst_percentage: { type: Number, default: 0 },
  // sgst_percentage: { type: Number, default: 0 },
  // igst_percentage: { type: Number, default: 0 },
  // discount_1: { type: Number, default: 0 },
  // discount_2: { type: Number, default: 0 },
  // discount_3: { type: Number, default: 0 },
  // hsn_code: { type: String, default: "" },
  // sale_price: { type: Number, required: true },
  // price: { type: Number, required: true },
});

const orderDispatchSchema = new Schema(
  {
    is_final: { type: Boolean, default: true },
    cartons: { type: Number, required: true, default: 0 },
    open_boxes: { type: Number, required: true, default: 0 },
    items: { type: [dispatchItemSchema], required: true, default: [] },
    remark: { type: String, default: "" },
    dispatch_id: { type: String, default: null },
    image: { type: String, default: null },
    synced: { type: Boolean, default: false },
    // subtotal: { type: Number, required: true, default: 0 },
    // total: { type: Number, required: true, default: 0 },
    dispatched_by: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    order_load_id: {
      type: Schema.Types.ObjectId,
      ref: "OrderLoad",
    },
    bilty_id: {
      type: Schema.Types.ObjectId,
      ref: "Bilty",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

orderDispatchSchema.virtual("order", {
  ref: "Order",
  localField: "order_id",
  foreignField: "_id",
  justOne: true,
});

orderDispatchSchema.virtual("bilty", {
  ref: "Bilty",
  localField: "bilty_id",
  foreignField: "_id",
  justOne: true,
});

orderDispatchSchema.plugin(paginate);

export interface OrderDispatchDocument extends Document<IOrderDispatch> {}

const OrderDispatchModel = model<IOrderDispatch, PaginateModel<IOrderDispatch>>(
  "OrderDispatch",
  orderDispatchSchema,
  "order_dispatches",
);

export default OrderDispatchModel;
