import { generateId } from "./counter.service";
import { CounterType } from "@repo/ui/dist/enums/counter";
import OrderDispatchModel from "../models/orderDispatch.model";
import {
  IOrderDispatch,
  IPaginatedOrderDispatchQuery,
  IGetOrderDispatchQuery,
} from "@repo/ui/dist/types/orderDispatch";
import { UserType } from "@repo/ui/dist/enums/user";
import { FilterQuery } from "mongoose";
import moment from "moment";
import { calculateOrderTotals, setOrderStatuses } from "./order.service";
import { XMLBuilder } from "fast-xml-parser";
import { groupProductsByCode } from "@repo/ui/dist/lib/product";
import * as busyService from "./busy.service";
import { IOrderItem } from "@repo/ui/dist/types/order";

export const getDispatchesForWPWithPagination = async (
  userId: string,
  query: IPaginatedOrderDispatchQuery,
) => {
  const where: FilterQuery<IOrderDispatch> = { created_by: userId, $or: [] };

  if (query.search?.length) {
    where.$or = [
      {
        "order.shop_name": {
          $regex: query.search,
          $options: "i",
        },
      },
      {
        dispatch_id: {
          $regex: query.search,
          $options: "i",
        },
      },
    ];
  }

  if (query.date) {
    where.$or?.push({
      created_at: {
        $gte: moment(query.date).startOf("day"),
        $lte: moment(query.date).endOf("day"),
      },
    });
  }

  return OrderDispatchModel.paginate(where, {
    sort: { created_at: -1 },
    page: query.page,
    limit: query.limit,
    populate: {
      path: "order",
      select: {
        shop_name: 1,
      },
    },
  });
};

export const getOrderDispatches = async (
  conditions: IGetOrderDispatchQuery,
) => {
  const where: FilterQuery<IOrderDispatch> = {};

  if (conditions.dispatch_ids) {
    where.dispatch_id = {
      $in: conditions.dispatch_ids,
    };
  }

  let query = OrderDispatchModel.find(where).populate({
    path: "order",
    populate: {
      path: "customer",
    },
  });

  // if(conditions.select){
  //   query = query.select(conditions.select);
  // }

  return query.lean().exec();
};

export const getOrderDispatchById = async (dispatchId: string) => {
  return OrderDispatchModel.findById(dispatchId).populate({
    path: "order",
    populate: {
      path: "customer",
    },
  });
};

export const addOrderDispatch = async (
  data: Pick<
    IOrderDispatch,
    | "order_id"
    | "items"
    | "remark"
    | "image"
    | "order_id"
    | "created_by"
    | "dispatched_by"
  >,
) => {
  const dispatchId = data.items.length
    ? await generateId(
        data.dispatched_by === UserType.PACKAGER
          ? CounterType.PACKAGE
          : CounterType.DISPATCH,
      )
    : null;

  const dispatch = new OrderDispatchModel({
    ...data,
    dispatch_id: dispatchId,
  });

  const savedDispatch = await dispatch.save();

  await setOrderStatuses({
    _id: data.order_id,
  });

  return savedDispatch;
};

export const updateDispatchById = async (
  dispatchId: string,
  cartons: number,
  open_boxes: number,
) => {
  const response = await OrderDispatchModel.findByIdAndUpdate(
    dispatchId,
    { $set: { cartons, open_boxes } },
    { new: true },
  );

  if (response?.order_id) {
    await setOrderStatuses({
      _id: response.order_id,
    });
  }

  return response;
};

export const syncSalesInvoices = async () => {
  // Fetch the dispatches which are not synced
  // Get the packages which are not synced
  const dispatches = await OrderDispatchModel.find(
    {
      dispatched_by: UserType.PACKAGER,
      synced: false,
    },
    {},
    {
      populate: {
        path: "order",
        populate: {
          path: "customer",
        },
      },
    },
  );

  const syncedInvoices = [];
  for await (const dispatch of dispatches) {
    // Invoice should not be synced if customer is not assigned
    if (!dispatch.order.customer_code) {
      continue;
    }

    const xml = await createInvoiceXML(dispatch);

    try {
      // Sync order to Busy
      const syncStatus = await busyService.syncInvoice(
        dispatch.dispatch_id,
        xml,
      );
      // Update sync status
      await OrderDispatchModel.updateOne(
        { _id: dispatch._id },
        { $set: { synced: syncStatus } },
      );

      if (syncStatus) {
        syncedInvoices.push(dispatch.dispatch_id);
      }
    } catch (error) {
      console.log("Error syncing invoice", error);
    }
  }

  return syncedInvoices;
};

export async function createInvoiceXML(
  dispatch: IOrderDispatch,
): Promise<string> {
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    suppressEmptyNode: true,
  });

  const { itemsToSave } = await calculateOrderTotals(
    dispatch.items.map((item) => ({
      code: item.code,
      color: item.color,
      size: item.size,
      qty: item.dispatch_qty,
      dispatch_qty: item.dispatch_qty,
    })),
    dispatch.order.customer_code,
  );

  const billDate = moment(dispatch.created_at).format("DD-MM-YYYY");

  const groupedItems = groupProductsByCode<IOrderItem>(itemsToSave);

  const xml = builder.build({
    Sale: {
      VchSeriesName: "Fawz",
      Date: billDate,
      VchType: "9",
      VchNo: dispatch.dispatch_id,
      STPTName: "L/GST-TaxIncl.",
      MasterName1: dispatch.order.customer?.name ?? dispatch.order.shop_name,
      MasterName2: "MAIN STORE",
      StockUpdationDate: billDate,
      TranCurName: "Rs.",
      OriginalID: `Fawz;${billDate};${dispatch.dispatch_id};Sale`,
      InputType: "1",
      BillingDetails: {
        PartyName: dispatch.order.customer?.name ?? dispatch.order.shop_name,
        MobileNo: dispatch.order.customer?.mobile_no ?? dispatch.order.mobile,
        tmpVchCode: "31537",
        tmpStateName: dispatch.order.customer?.state ?? "",
      },
      VchOtherInfoDetails: {
        Transport: dispatch.order.transport_name ?? "* Not Mentioned",
        PurchaseBillNo: dispatch.dispatch_id,
        PurchaseBillDate: moment(dispatch.created_at).format("DD-MM-YYYY"),
        Narration1: `${dispatch.order?.customer?.name ?? dispatch.order?.shop_name} ${dispatch.order?.city} ${dispatch.order.order_id}`,
        GrDate: moment(dispatch.created_at).format("DD-MM-YYYY"),
      },
      ItemEntries: {
        ItemDetail: Object.values(groupedItems).map((items, index) => {
          const firstItem = items[0];
          const totalItemQty = items.reduce(
            (acc, item) => acc + item.dispatch_qty,
            0,
          );

          return {
            Date: billDate,
            VchType: "9",
            VchNo: dispatch.dispatch_id,
            SrNo: index + 1,
            ItemName: firstItem.name,
            UnitName: "P",
            AltUnitName: "Pcs.",
            // ConFactor: "",
            Qty: totalItemQty,
            QtyMainUnit: totalItemQty,
            // QtyAltUnit: "",
            ItemHSNCode: firstItem.hsn_code,
            // ItemTaxCategory: "",
            // //     NettAmount: item.NettAmount,
            // //     Discount: item.Discount,
            // //     CompoundDiscount: item.CompoundDiscount,
            // // AF: "",
            Price: firstItem.sale_price,
            ListPrice: firstItem.price,
            Amt: firstItem.sale_price * totalItemQty,
            DiscountPercent: firstItem.discount_1,
            STAmount: "",
            STPercent: firstItem.cgst_percentage,
            STPercent1: firstItem.sgst_percentage,
            TaxBeforeSurcharge: "",
            TaxBeforeSurcharge1: "",
            MC: "Main Store",
            ParamStockEntries: {
              ParamStockDetails: items.map((item) => ({
                Param1: item.brand.includes("Campus") ? item.size : item.color,
                Param2: item.brand.includes("Campus") ? item.color : item.size,
                Param3: item.ean_code,
                MainQty: item.dispatch_qty,
                MRP: item.MRP,
                MainUnitPrice: item.sale_price,
                Amount: item.sale_price * item.dispatch_qty,
              })),
            },
          };
        }),
      },
    },
  });

  return xml;
  // return '<?xml version="1.0" encoding="iso8859-1"?>' + xml;
}
