import { Schema, model } from "mongoose";
import { IItemGroup } from "@repo/ui/dist/types/itemGroup";

const itemGroupSchema = new Schema<IItemGroup>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const ItemGroupModel = model<IItemGroup>(
  "ItemGroup",
  itemGroupSchema,
  "item_groups",
);

export default ItemGroupModel;
