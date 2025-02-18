import { model, PaginateModel, Schema } from "mongoose";
import { IOrderLoad } from "@repo/ui/dist/types/orderLoad";
import { Document } from "mongoose";
import paginate from "mongoose-paginate-v2";

const orderLoadSchema = new Schema(
  {
    dispatch_ids: [{ type: Schema.Types.ObjectId, ref: "OrderDispatch" }],
    order_load_id: { type: String, required: true, unique: true },
    loading_id: { type: Schema.Types.ObjectId, ref: "Loading", required: true },
    image: { type: String, required: true },
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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

orderLoadSchema.plugin(paginate);

export interface OrderLoadDocument extends Document<IOrderLoad> {}

const OrderLoadModel = model<IOrderLoad, PaginateModel<IOrderLoad>>(
  "OrderLoad",
  orderLoadSchema,
  "order_loads",
);

export default OrderLoadModel;
