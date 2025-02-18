import { array } from "joi";
import mongoose, { Schema, Document } from "mongoose";

const biltySchema: Schema = new Schema(
  {
    dispatch_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "OrderDispatch",
    },
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    transport_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Transport",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
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

biltySchema.virtual("dispatch", {
  ref: "OrderDispatch",
  localField: "dispatch_id",
  foreignField: "_id",
  justOne: true,
});

biltySchema.virtual("order", {
  ref: "Order",
  localField: "order_id",
  foreignField: "_id",
  justOne: true,
});

biltySchema.virtual("transport", {
  ref: "Transport",
  localField: "transport_id",
  foreignField: "_id",
  justOne: true,
});

export interface IBiltyDocument extends Document {
  dispatchId: string;
  shop_name: string;
  image: string;
}

const BiltyModel = mongoose.model<IBiltyDocument>("Bilty", biltySchema);

export default BiltyModel;
