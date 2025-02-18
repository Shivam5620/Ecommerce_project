import { Document, model, Schema } from "mongoose";
import { UserType } from "@repo/ui/dist/enums/user";
import { IUser } from "@repo/ui/dist/types/user";

const userSchema = new Schema(
  {
    status: { type: Boolean, required: true, default: true },
    vendor_id: { type: Number, required: true, default: 0 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: Object.values(UserType), required: true },
    assignedRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    mobile: { type: Number, required: true, default: 0 },
    image: { type: String, required: true, default: null },
    warehouses: { type: [String], required: true, default: [] },
    loading_id: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
      default: null,
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

userSchema.virtual("role", {
  ref: "Role",
  localField: "assignedRole",
  foreignField: "_id",
  justOne: true,
});

export interface UserDocument extends Document {}

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
