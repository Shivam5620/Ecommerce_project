import {
  ConfigurationKey,
  ConfigurationType,
} from "@repo/ui/dist/enums/configuration";
import { IConfiguration } from "@repo/ui/dist/types/configuration";
import { Document, model, Schema } from "mongoose";

export const configurationSchema = new Schema<IConfiguration>(
  {
    key: {
      type: String,
      enum: Object.values(ConfigurationKey),
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ConfigurationType),
      required: true,
    },
    value: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export interface ProductDocument extends Document {}

const ConfigurationModel = model<IConfiguration>(
  "Configuration",
  configurationSchema,
);

export default ConfigurationModel;
