import { Schema, model } from "mongoose";
import { ITransport } from "@repo/ui/dist/types/transport";

const transportSchema = new Schema(
  {
    dispatch_ids: [{ type: Schema.Types.ObjectId, ref: "OrderDispatch" }],
    driver_name: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    image: { type: String, required: true },
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

export interface TransportDocument extends Document {}

const TransportModel = model<ITransport>("Transport", transportSchema);

export default TransportModel;
