import { Schema, model } from "mongoose";
import { IShipment } from "@repo/ui/dist/types/shipment";

const shipmentSchema = new Schema({
  open_boxes: { type: Number, required: true, default: 0 },
  cartons: { type: Number, required: true, default: 0 },
  dispatch_id: {
    type: Schema.Types.ObjectId,
    ref: "Dispatch",
    required: true,
  },
});

export interface ShipmentDocument extends Document {}

const ShipmentModel = model<IShipment>("Shipment", shipmentSchema);

export default ShipmentModel;
