import {
  ICreateOrderRequestBody,
  IGetOrdersQuery,
  IGetPaginatedOrdersQuery,
  IOrder,
  IOrderItem,
} from "@repo/ui/dist/types/order";
import * as productService from "./product.service";
import { AppError } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import OrderModel from "../models/order.model";
import { getDiscountedPrice } from "@repo/ui/dist/utils/cart";
import { generateId } from "./counter.service";
import { CounterType } from "@repo/ui/dist/enums/counter";
import { OrderStatus } from "@repo/ui/dist/enums/order";
import * as counterService from "./counter.service";
import * as customerDiscountService from "./customerDiscount.service";
import * as customerService from "./customer.service";
import * as configurationService from "./configuration.service";
import { UserType } from "@repo/ui/dist/enums/user";
import { FilterQuery } from "mongoose";
import { ICustomerDiscount } from "@repo/ui/dist/types/customerDiscount";
import { CustomerDiscountType } from "@repo/ui/dist/enums/customerDiscount";
import { ConfigurationKey } from "@repo/ui/dist/enums/configuration";
import { ICustomer } from "@repo/ui/dist/types/customer";
import { PaginatedData } from "@repo/ui/dist/types/paginate";
import { IOrderDispatch } from "@repo/ui/dist/types/orderDispatch";

export const addOrder = async (
  data: ICreateOrderRequestBody,
): Promise<IOrder> => {
  const { total, subtotal, itemsToSave } = await calculateOrderTotals(
    data.items,
  );
  const orderId = await generateId(CounterType.ORDER);

  const warehouseWiseCounts: WarehouseWiseCounts = getWarehouseWiseCounts(
    itemsToSave,
    [],
  );

  const newOrder = new OrderModel({
    order_id: orderId,
    shop_name: data.shop_name,
    items: itemsToSave,
    isd: data.isd,
    mobile: data.mobile,
    city: data.city,
    subtotal,
    total,
    cgst: 0,
    sgst: 0,
    igst: 0,
    status: OrderStatus.PENDING,
    warehouse_status: getWarehouseStatus(warehouseWiseCounts),
    remark: data.remark,
  });

  return newOrder.save();
};

export const getAllOrders = async (conditions: IGetOrdersQuery) => {
  const where: FilterQuery<IOrder> = { $or: [] };

  if (conditions.search) {
    where.$or = [
      {
        order_id: {
          $regex: conditions.search,
          $options: "i",
        },
      },
      {
        batch_id: {
          $regex: conditions.search,
          $options: "i",
        },
      },
      {
        shop_name: {
          $regex: conditions.search,
          $options: "i",
        },
      },
      {
        city: {
          $regex: conditions.search,
          $options: "i",
        },
      },
      {
        mobile: {
          $regex: conditions.search,
          $options: "i",
        },
      },
    ];
  }
  let query = OrderModel.find(
    where,
    {},
    {
      populate: [
        {
          path: "dispatches",
          select: "dispatch_id",
          match: {
            dispatched_by: UserType.PACKAGER,
          },
        },
        {
          path: "customer",
          select: "code name",
        },
      ],
    },
  );

  if (conditions.select) {
    query = query.select(conditions.select);
  }

  return query.lean().exec();
};

export const cancelOrders = async (order_ids: string[]) => {
  const orders = await OrderModel.find({ order_id: { $in: order_ids } });

  if (orders.length === 0) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      `No orders found with the provided orderIds`,
    );
  }

  await OrderModel.updateMany(
    { order_id: { $in: order_ids } },
    { $set: { status: OrderStatus.CANCELLED } },
  );

  const updatedOrders = await OrderModel.find({
    order_id: { $in: order_ids },
  }).lean();

  return updatedOrders;
};

export const batchOrders = async (orderIds: string[]) => {
  const orders = await OrderModel.find({ order_id: { $in: orderIds } });

  if (orders.length !== orderIds.length) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      `Some orders not found with the provided orderIds`,
    );
  }

  const unassignedOrders = orders.filter(
    (order) =>
      order.customer_code === undefined || order.customer_code.length === 0,
  );
  if (unassignedOrders.length > 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      ` Orders ${unassignedOrders.map((o) => o.order_id).join(", ")} does not have customer assigned`,
    );
  }

  const batchId = await counterService.generateId(CounterType.BATCH);

  await OrderModel.updateMany(
    { order_id: { $in: orderIds } },
    { batch_id: batchId, status: OrderStatus.BATCHED },
  );

  const updatedOrders = await OrderModel.find({
    order_id: { $in: orderIds },
  }).lean();

  await setOrderStatuses({ order_id: { $in: orderIds } });

  return updatedOrders;
};

type WarehouseWiseCounts = {
  [key: string]: {
    qty: number;
    dispatch_qty: number;
    pack_qty: number;
    dispatched: boolean;
    packed: boolean;
  };
};

function getWarehouseWiseCounts(
  items: Array<IOrderItem>,
  dispatches: Array<IOrderDispatch>,
): WarehouseWiseCounts {
  const warehouseWiseCounts: WarehouseWiseCounts = {};

  // Calculate quantities for each warehouse
  items.forEach((item) => {
    const warehouse = item.product_details?.rack_no ?? "";
    if (warehouseWiseCounts[warehouse]) {
      warehouseWiseCounts[warehouse].qty += item.qty;
      warehouseWiseCounts[warehouse].dispatch_qty += item.dispatch_qty;
      warehouseWiseCounts[warehouse].pack_qty += item.pack_qty;
    } else {
      warehouseWiseCounts[warehouse] = {
        qty: item.qty,
        dispatch_qty: item.dispatch_qty,
        pack_qty: item.pack_qty,
        dispatched: false,
        packed: false,
      };
    }
  });

  // Update the dispatched and packed status based on dispatches
  dispatches.forEach((dispatch) => {
    if (dispatch.is_final) {
      dispatch.items.forEach((dispatchItem) => {
        const item = items.find(
          (orderItem) =>
            orderItem.code === dispatchItem.code &&
            orderItem.color === dispatchItem.color &&
            orderItem.size === dispatchItem.size,
        );

        if (item) {
          const warehouse = item.product_details?.rack_no || "";
          if (dispatch.dispatched_by === UserType.WAREHOUSEMANAGER) {
            warehouseWiseCounts[warehouse].dispatched = true;
          } else if (dispatch.dispatched_by === UserType.PACKAGER) {
            warehouseWiseCounts[warehouse].packed = true;
          }
        }
      });
    }
  });

  return warehouseWiseCounts;
}

function getWarehouseStatus(warehouseWiseCounts: WarehouseWiseCounts) {
  return Object.entries(warehouseWiseCounts)
    .map(([key, value]) => {
      return {
        warehouse: key,
        ...value,
      };
    })
    .sort((a, b) => a.warehouse.localeCompare(b.warehouse));
}

export async function setOrderStatuses(conditions: any = {}): Promise<any> {
  // ------------------------------------------------------------------------------------
  // GET THE ORDERS
  // ------------------------------------------------------------------------------------
  const orders = await OrderModel.find(conditions, {
    order_id: 1,
    items: 1,
    dispatches: 1,
    status: 1,
  })
    .populate({
      path: "dispatches",
      select: {
        // dispatch_id: 1,
        is_final: 1,
        items: {
          code: 1,
          color: 1,
          size: 1,
          qty: 1,
          dispatch_qty: 1,
          pack_qty: 1,
          rack_no: 1,
          product_details: {
            rack_no: 1,
          },
        },
        dispatched_by: 1,
        order_load_id: 1,
      },
    })
    .exec();

  // Generate Bulk update array
  const bulkUpdateArray = orders.map((order) => {
    const dispatches = order.dispatches || [];

    // ------------------------------------------------------------------------------------
    // GET THE WAREHOUSE WISE COUNTS
    // ------------------------------------------------------------------------------------
    const warehouseWiseCounts: WarehouseWiseCounts = getWarehouseWiseCounts(
      order.items,
      dispatches,
    );

    const warehouseStatus = getWarehouseStatus(warehouseWiseCounts);

    // ------------------------------------------------------------------------------------
    // DETERMINE DISPATCH STATUS
    // ------------------------------------------------------------------------------------
    let dispatchStatus = order.status;

    let allDispatched = true;
    let allPacked = true;
    let noneDispatched = true;

    for (const warehouse in warehouseWiseCounts) {
      const value = warehouseWiseCounts[warehouse];
      if (!value.dispatched) {
        allDispatched = false;
      } else {
        noneDispatched = false;
      }
      if (!value.packed) {
        allPacked = false;
      }
    }

    if (allPacked) {
      dispatchStatus = OrderStatus.PACKED;
    } else if (allDispatched && !allPacked) {
      dispatchStatus = OrderStatus.UNDER_PACK;
    } else if (!noneDispatched && !allDispatched) {
      dispatchStatus = OrderStatus.PARTIAL_DISPATCH;
    } else if (noneDispatched) {
      dispatchStatus = OrderStatus.UNDER_DISPATCH;
    }
    if (dispatchStatus === OrderStatus.PACKED) {
      let allShipped = true;
      for (const dispatch of dispatches) {
        if (dispatch.dispatched_by !== UserType.PACKAGER) continue;

        if (!dispatch.order_load_id) {
          allShipped = false;
          break;
        }
      }
      if (allShipped) {
        dispatchStatus = OrderStatus.SHIPPED;
      }
    }

    return {
      updateOne: {
        filter: { order_id: order.order_id },
        update: {
          $set: {
            status: dispatchStatus,
            warehouse_status: warehouseStatus,
          },
        },
      },
    };
  });

  // Update the orders
  return await OrderModel.bulkWrite(bulkUpdateArray);
}

export const updateOrder = async (orderId: string, data: IOrder) => {
  const { items: updatedItems } = data;

  const order = await OrderModel.findById(orderId).lean();
  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  if (Array.isArray(updatedItems) && updatedItems.length > 0) {
    const { subtotal, total, itemsToSave } = await calculateOrderTotals(
      updatedItems,
      data.customer_code ?? order.customer_code,
    );

    data.items = itemsToSave;
    data.subtotal = subtotal;
    data.total = total;
  } else if (data.customer_code) {
    const { subtotal, total, itemsToSave } = await calculateOrderTotals(
      order.items,
      data.customer_code,
    );

    data.items = itemsToSave;
    data.subtotal = subtotal;
    data.total = total;
  }

  const newOrder = await OrderModel.findByIdAndUpdate(orderId, data, {
    new: true,
    runValidators: true,
    populate: "customer",
  }).exec();

  return newOrder;
};

export const calculateOrderTotals = async (
  orderItems: Array<{
    code: string;
    color: string;
    size: string;
    qty: number;
    dispatch_qty?: number;
    pack_qty?: number;
    comment?: string;
  }>,
  customerCode?: string,
) => {
  const orderItemCodes = orderItems.map((item) => item.code);
  const dbItems = await productService.find({
    code: { $in: [...new Set(orderItemCodes)] },
  });

  let orderTotal = 0;
  let orderSubtotal = 0;

  const itemsToSave: IOrderItem[] = [];

  let customerDiscounts: ICustomerDiscount[] = [];
  let customer: ICustomer | null = null;
  if (customerCode) {
    customerDiscounts = await customerDiscountService.getAllCustomerDiscounts({
      customer_code: customerCode,
    });

    customer = await customerService.getCustomer({ code: customerCode });
  }

  const configurationGstThreshold =
    await configurationService.getConfigurationByKey(
      ConfigurationKey.GST_THRESHOLD,
    );

  const configurationAboveGstThreshold =
    await configurationService.getConfigurationByKey(
      ConfigurationKey.GST_ABOVE_THRESHOLD,
    );
  const configurationBelowGstThreshold =
    await configurationService.getConfigurationByKey(
      ConfigurationKey.GST_BELOW_THRESHOLD,
    );

  const gstThreshold = configurationGstThreshold?.value
    ? parseInt(configurationGstThreshold.value)
    : 0;
  const gstAboveThreshold = configurationAboveGstThreshold?.value
    ? parseInt(configurationAboveGstThreshold.value)
    : 0;
  const gstBelowThreshold = configurationBelowGstThreshold?.value
    ? parseInt(configurationBelowGstThreshold.value)
    : 0;

  for (const orderItem of orderItems) {
    const item = dbItems.find(
      (item) =>
        item.code === orderItem.code &&
        item.color === orderItem.color &&
        item.size === orderItem.size,
    );

    if (!item) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Item ${orderItem.code} not found`,
      );
    }

    let itemQty = orderItem.qty;
    let itemSubtotal = item.sale_price * itemQty;
    let itemPrice = getDiscountedPrice(item.sale_price, item.discount);
    orderSubtotal += itemSubtotal;
    let discount_1 = item.discount;
    let discount_2 = 0;
    let discount_3 = 0;
    if (customerCode) {
      const customerDiscountForProduct = customerDiscounts.find(
        (discount) =>
          discount.product_code === item.product_code &&
          discount.type === CustomerDiscountType.PRODUCT,
      );

      const customerDiscountForItemGroup = customerDiscounts.find(
        (discount) =>
          discount.item_group_code === item.item_group_code &&
          discount.type === CustomerDiscountType.ITEM_GROUP,
      );

      // Check if product discount is there
      if (customerDiscountForProduct) {
        discount_1 = customerDiscountForProduct.discount_1;
        discount_2 = customerDiscountForProduct.discount_2;
        discount_3 = customerDiscountForProduct.discount_3;
        itemPrice = getDiscountedPrice(
          item.sale_price,
          customerDiscountForProduct.discount_1,
          customerDiscountForProduct.discount_2,
          customerDiscountForProduct.discount_3,
        );
      } else if (customerDiscountForItemGroup) {
        discount_1 = customerDiscountForItemGroup.discount_1;
        discount_2 = customerDiscountForItemGroup.discount_2;
        discount_3 = customerDiscountForItemGroup.discount_3;
        itemPrice = getDiscountedPrice(
          item.sale_price,
          customerDiscountForItemGroup.discount_1,
          customerDiscountForItemGroup.discount_2,
          customerDiscountForItemGroup.discount_3,
        );
      }
    }

    let gstPercentage =
      itemPrice > gstThreshold ? gstAboveThreshold : gstBelowThreshold;

    let itemTaxableAmount = 1 + gstPercentage / 100;
    itemTaxableAmount = itemPrice / itemTaxableAmount;

    console.log({
      itemPrice,
      gstPercentage,
      gstThreshold,
      gstAboveThreshold,
      gstBelowThreshold,
    });
    let itemCGSTPercentage = 0;
    let itemSGSTPercentage = 0;
    let itemIGSTPercentage = 0;
    if (customer?.state === "Madhya Pradesh") {
      itemCGSTPercentage = gstPercentage / 2;
      itemSGSTPercentage = gstPercentage / 2;
    } else {
      itemIGSTPercentage = gstPercentage;
    }

    const itemTotal = itemQty * itemPrice;
    orderTotal += itemTotal;

    itemsToSave.push({
      size: orderItem.size,
      MOQ: item.MOQ,
      MRP: item.MRP,
      price: item.sale_price,
      sale_price: itemPrice,
      qty: itemQty,
      name: item.name,
      color: orderItem.color,
      brand: item.brand,
      cgst_percentage: itemCGSTPercentage,
      sgst_percentage: itemSGSTPercentage,
      igst_percentage: itemIGSTPercentage,
      hsn_code: item.hsn_code,
      ean_code: item.ean_code,
      discount_1,
      discount_2,
      discount_3,
      code: orderItem.code,
      subtotal: itemSubtotal,
      discount: parseFloat((itemSubtotal - itemTotal).toFixed(2)),
      total: itemTotal,
      dispatch_qty: orderItem.dispatch_qty ?? 0,
      rack_no: item.rack_no,
      pack_qty: orderItem.pack_qty ?? 0,
      comment: orderItem.comment ?? "NA",
      product_details: item,
    });
  }

  return {
    subtotal: orderSubtotal,
    total: orderTotal,
    itemsToSave,
  };
};

export const getOrderById = async (orderId: string) => {
  return await OrderModel.findById(orderId)
    .populate([
      {
        path: "customer",
      },
      {
        path: "dispatches",
        populate: {
          path: "bilty",
          select: {
            image: 1,
          },
        },
      },
    ])
    .lean()
    .exec();
};

export const getPaginatedOrders = async (
  conditions: IGetPaginatedOrdersQuery,
): Promise<PaginatedData<IOrder>> => {
  const {
    page = 1,
    limit = 10,
    search,
    select,
    sortField,
    sortOrder,
  } = conditions;

  const where: FilterQuery<IOrder> = { $or: [] };

  if (search) {
    where.$or = [
      { order_id: { $regex: search, $options: "i" } },
      { batch_id: { $regex: search, $options: "i" } },
      { shop_name: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  const sort: any = {};
  if (sortField && sortOrder) {
    sort[sortField] = sortOrder === "desc" ? -1 : 1;
  }

  return OrderModel.paginate(where, {
    select,
    sort,
    populate: [
      {
        path: "dispatches",
        select: "dispatch_id synced",
        match: { dispatched_by: UserType.PACKAGER },
      },
      { path: "customer", select: "code name" },
    ],
    lean: true,
    limit,
    page,
  });
};
