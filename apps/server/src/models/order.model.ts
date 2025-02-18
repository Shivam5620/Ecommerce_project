import { model, PaginateModel, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { productSchema } from "./product.model";
import { OrderStatus } from "@repo/ui/dist/enums/order";
import {
  IOrder,
  IOrderItem,
  IWarehouseStatus,
} from "@repo/ui/dist/types/order";

const warehouseStatusSchema = new Schema<IWarehouseStatus>({
  warehouse: { type: String, required: true },
  qty: { type: Number, default: 0 },
  dispatch_qty: { type: Number, default: 0 },
  pack_qty: { type: Number, default: 0 },
  dispatched: { type: Boolean, default: false },
  packed: { type: Boolean, default: false },
});

const orderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  MOQ: { type: Number, required: true },
  price: { type: Number, required: true },
  sale_price: { type: Number, required: true },
  discount_1: { type: Number, default: 0 },
  discount_2: { type: Number, default: 0 },
  discount_3: { type: Number, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  qty: { type: Number, required: true },
  cgst_percentage: { type: Number, default: 0 },
  sgst_percentage: { type: Number, default: 0 },
  igst_percentage: { type: Number, default: 0 },
  subtotal: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  hsn_code: { type: String, default: "" },
  ean_code: { type: String, default: "" },
  dispatch_qty: { type: Number, required: true, default: 0 },
  pack_qty: { type: Number, required: true, default: 0 },
  comment: { type: String, default: "" },
  rack_no: { type: String, default: "" },
  product_details: { type: productSchema, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    order_id: { type: String, required: true, unique: true },
    name: { type: String, default: null },
    shop_name: { type: String, required: true },
    transport_name: { type: String, default: null },
    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },
    customer_code: { type: String, default: null },
    isd: { type: Number, required: true },
    mobile: { type: Number, required: true },
    city: { type: String, required: true },
    subtotal: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    remark: { type: String, default: "" },
    batch_id: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
      default: OrderStatus.PENDING,
    },
    warehouse_status: {
      type: [warehouseStatusSchema],
      default: [],
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

orderSchema.virtual("dispatches", {
  ref: "OrderDispatch",
  localField: "_id",
  foreignField: "order_id",
  justOne: false,
});

orderSchema.virtual("customer", {
  ref: "Customer",
  localField: "customer_code",
  foreignField: "code",
  justOne: true,
});

// paginate with this plugin
orderSchema.plugin(paginate);

const OrderModel = model<IOrder, PaginateModel<IOrder>>("Order", orderSchema);

export default OrderModel;
