import TransportModel from "../models/transport.model";
import OrderModel from "../models/order.model";
import OrderDispatchModel from "../models/orderDispatch.model";

export const addTransport = async (data: any) => {
  const newTransport = new TransportModel(data);
  await newTransport.save();
  await OrderDispatchModel.updateMany(
    { _id: { $in: data.dispatch_ids } },
    { transport_id: newTransport._id },
  );

  return newTransport;
};

export const getOrdersTransport = async () => {
  const orders = await OrderModel.find(
    { dispatches: { $ne: [] } },
    {
      shop_name: 1,
      order_id: 1,
      dispatches: 1,
      created_at: 1,
    },
  ).populate({
    path: "dispatches",
    match: {
      transport_id: { $exists: false },
      $or: [{ cartons: { $gt: 0 } }, { open_boxes: { $gt: 0 } }],
    },
    select: {
      dispatch_id: 1,
      created_at: 1,
      cartons: 1,
      open_boxes: 1,
    },
  });

  return orders.filter(
    (order) => Array.isArray(order.dispatches) && order.dispatches.length > 0,
  );
};
