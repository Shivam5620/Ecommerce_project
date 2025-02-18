import { UserType } from "@repo/ui/dist/enums/user";
import DispatchModel from "../models/orderDispatch.model";
import moment from "moment";
import { number } from "joi";
import TransportModel from "../models/transport.model";
import { AppError } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import BiltyModel from "../models/bilty.model";
import OrderDispatchModel from "../models/orderDispatch.model";
import { ICreateBiltyRequestBody } from "@repo/ui/dist/types/bilty";

const populateBiltyOptions = [
  {
    path: "dispatch",
    select:
      "-is_final -cartons -open_boxes -remark -items -image -created_by -transport_id -bilty_id",
  },
  {
    path: "order",
    select: "shop_name",
  },
  {
    path: "transport",
    select: "vehicle_number driver_name",
  },
];

export const addBilty = async (
  data: ICreateBiltyRequestBody,
  userId?: string,
) => {
  // Validate if order dispatch already has a bilty_id
  const dispatch = await DispatchModel.findById(data.dispatch_id);
  if (!dispatch) {
    throw new AppError(StatusCodes.NOT_FOUND, "Dispatch not found");
  }

  if (dispatch.bilty_id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Dispatch already has a bilty");
  }

  const bilty = new BiltyModel({
    ...data,
    order_load_id: dispatch.order_load_id,
    order_id: dispatch.order_id,
    created_by: userId,
  });

  await bilty.save();

  await OrderDispatchModel.updateMany(
    { _id: data.dispatch_id },
    { bilty_id: bilty._id },
  )
    .lean()
    .exec();

  return bilty.populate(populateBiltyOptions);
};

export const fetchBiltys = async (userId?: string) => {
  return BiltyModel.find({
    // created_by: userId,
  })
    .populate(populateBiltyOptions)
    .lean()
    .exec();
};

export const fetchDispatchesByTransportNumberAndDate = async (
  vehicle_number: string,
  date: Date,
) => {
  // Get the transport based on vehicle number and date
  const transport = await TransportModel.findOne({
    vehicle_number,
    created_at: {
      $gte: moment(date).startOf("day"),
      $lte: moment(date).endOf("day"),
    },
  });

  if (!transport) {
    throw new AppError(StatusCodes.NOT_FOUND, "Transport not found");
  }

  return DispatchModel.find(
    {
      transport_id: transport._id,
      bilty_id: { $exists: false },
    },
    {
      items: 0,
    },
  )
    .populate({
      path: "order",
      select: "shop_name",
    })
    .lean()
    .exec();
};
