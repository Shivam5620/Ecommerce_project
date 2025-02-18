import { Schema, model, Document } from "mongoose";
import { ICounter } from "@repo/ui/dist/types/counter";
import { CounterType } from "@repo/ui/dist/enums/counter";

const counterSchema = new Schema<ICounter>(
  {
    series: { type: String, required: true },
    type: { type: String, enum: Object.values(CounterType), required: true },
    count: { type: Number, required: true, default: 1 },
    expire_at: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const CounterModel = model<ICounter>("Counter", counterSchema);
export default CounterModel;
