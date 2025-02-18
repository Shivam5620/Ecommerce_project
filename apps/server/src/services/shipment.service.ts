import { UserType } from "@repo/ui/dist/enums/user";
import OrderDispatchModel from "../models/orderDispatch.model";

export const getDispatchesToShip = async () => {
  return OrderDispatchModel.find(
    {
      dispatched_by: UserType.PACKAGER,
      items: { $ne: [] }, // Filter dispatches with no items
      cartons: 0,
      open_boxes: 0,
    },
    {
      dispatch_id: 1,
      order_id: 1,
      cartons: { $ifNull: [{ $toInt: "$cartons" }, 0] },
      open_boxes: { $ifNull: [{ $toInt: "$open_boxes" }, 0] },
      created_at: 1,
    },
    {
      sort: { created_at: 1 },
    },
  ).populate([
    {
      path: "order",
      select: "order_id shop_name created_at",
    },
  ]);
};
