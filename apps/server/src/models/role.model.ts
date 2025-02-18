import mongoose, { Document, model, Schema } from "mongoose";
import { IRole } from "@repo/ui/dist/types/role";
import { permissionSchema } from "./permission.model";
const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    permissions: {
      type: [permissionSchema],
      required: true,
    },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const RoleModel = model<IRole>("Role", roleSchema);

export default RoleModel;
