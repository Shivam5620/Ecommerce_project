import mongoose, { Schema, Document } from "mongoose";
import { ICustomerBeatSchedule } from "@repo/ui/dist/types/customerBeatSchedule";

const customerBeatScheduleSchema: Schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    customer_beat_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CustomerBeat",
    },
    date: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
customerBeatScheduleSchema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

customerBeatScheduleSchema.virtual("customer_beat", {
  ref: "CustomerBeat",
  localField: "customer_beat_id",
  foreignField: "_id",
  justOne: true,
});

const CustomerBeatScheduleModel = mongoose.model<ICustomerBeatSchedule>(
  "CustomerBeatSchedule",
  customerBeatScheduleSchema,
  "customer_beat_schedules",
);

export default CustomerBeatScheduleModel;
