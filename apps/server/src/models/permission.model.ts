import mongoose, { Document, model, Schema } from "mongoose";
import { IPermission } from "@repo/ui/dist/types/permission";
import { AllowedPermission } from "@repo/ui/dist/enums/permission";

export const permissionSchema = new Schema<IPermission>(
  {
    module: { type: String, required: true },
    feature: { type: String, required: true },
    create: { type: Boolean, required: true },
    read: { type: Boolean, required: true },
    update: { type: Boolean, required: true },
    delete: { type: Boolean, required: true },
    import: { type: Boolean, required: true },
    export: { type: Boolean, required: true },
  },
  { timestamps: true },
);

export interface PermissionDocument extends Document {}

const PermissionModel = model<IPermission>("Permission", permissionSchema);

export default PermissionModel;
