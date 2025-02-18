import { UserType } from "@repo/ui/dist/enums/user";
import OrderDispatchModel from "../models/orderDispatch.model";
import OrderLoadModel from "../models/orderLoad.model";
import { getNextSequenceWithPrefix } from "./counter.service";
import { CounterType } from "@repo/ui/dist/enums/counter";
import { setOrderStatuses } from "./order.service";

export const addOrderLoad = async (data: any) => {
  const newLoad = new OrderLoadModel({
    ...data,
    order_load_id: await getNextSequenceWithPrefix(
      CounterType.ORDER_LOADING,
      "LOAD",
    ),
  });
  await newLoad.save();
  await OrderDispatchModel.updateMany(
    { _id: { $in: data.dispatch_ids } },
    { order_load_id: newLoad._id },
  );

  // Get orderIds from dispatches
  const dispatches = await OrderDispatchModel.find({
    _id: { $in: data.dispatch_ids },
  });

  // Update order status to loaded
  if (dispatches.length > 0) {
    await setOrderStatuses({
      _id: { $in: dispatches.map((d) => d.order_id) },
    });
  }

  return newLoad;
};

export const getDispatchesToLoad = async () => {
  return OrderDispatchModel.find(
    {
      dispatched_by: UserType.PACKAGER,
      order_load_id: { $exists: false },
      $or: [{ cartons: { $gt: 0 } }, { open_boxes: { $gt: 0 } }],
    },
    {
      items: 0,
    },
  ).populate({
    path: "order",
    select: "shop_name order_id",
  });
};
