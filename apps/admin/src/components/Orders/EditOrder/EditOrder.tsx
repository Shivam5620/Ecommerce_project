import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import moment from "moment";
import { IOrder, IUpdateOrderItemRequestBody } from "@repo/ui/types/order";
import config from "../../../config";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchOrderById,
  fetchUpdateOrder,
} from "../../../app/feature/orderSlice";
import { fetchProducts } from "../../../app/feature/productSlice";
import { generateUUID } from "@repo/ui/lib/index";
import AdditionalOrderItem from "./AdditionalOrderItem";

export interface SelectOption {
  label: string;
  value: string;
}

const EditOrder = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<IOrder>();
  const [orderItems, setOrderItems] = useState<
    Array<IUpdateOrderItemRequestBody>
  >([]);
  const orders = useAppSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(
      fetchProducts({
        available: true,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (orders.length) {
      const order = orders.find((order) => order._id === id);
      if (order) {
        setOrder(order);
        setOrderItems(
          order.items?.map(({ size, qty, color, code, comment, name }) => ({
            id: generateUUID(),
            name,
            size,
            qty,
            color,
            code,
            comment,
          })) || [],
        );
      }
    } else {
      setOrder(undefined);
    }
  }, [orders, id]);

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        id: generateUUID(),
        name: "",
        size: "",
        qty: 0,
        color: "",
        code: "",
        comment: "",
      },
    ]);
  };

  const updateOrderItem = (
    index: number,
    item: IUpdateOrderItemRequestBody,
  ) => {
    const newAdditionalItems = [...orderItems];
    newAdditionalItems[index] = item;
    setOrderItems(newAdditionalItems);
  };

  if (!order) return "Order Details not found";
  const handleSave = () => {
    if (!order || !order._id) {
      alert("Order ID is missing!");
      return;
    }

    const orderItemsToSubmit: IUpdateOrderItemRequestBody[] = orderItems.map(
      (item) => ({
        size: item.size,
        qty: item.qty,
        color: item.color,
        code: item.code,
        comment: item.comment,
      }),
    );

    dispatch(
      fetchUpdateOrder({ id: order._id, data: { items: orderItemsToSubmit } }),
    );
  };

  return (
    <>
      <Card className="mb-3">
        <div className="card-title">
          <p className="text-[#000] mb-3 text-capitalize font-bold">Orders</p>
          <p className="font-normal text-[#76838f] text-[0.875rem] mb-3">
            Edit order
          </p>
        </div>
      </Card>

      <Card>
        <div>
          <div className="grid md:grid-cols-1 gap-3 items-center mb-3">
            <div>
              <div>
                <div className="flex gap-2 items-center">
                  <strong>{order.shop_name}</strong>
                  <strong className="text-blue-500">{order.mobile}</strong>
                </div>
                <div className="flex gap-2 items-center">
                  <strong>Order ID:</strong>
                  <strong>{order.order_id}</strong>
                </div>
                <div className="flex gap-2 items-center">
                  <strong>
                    Order Date:{" "}
                    {moment(order.created_at).format(config.date.format)}
                  </strong>
                  <strong></strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <h4 className="text-center font-semibold">Order Items</h4>

          {orderItems.map((item, index) => (
            <AdditionalOrderItem
              key={item.id}
              item={item}
              index={index}
              onDelete={(index) => {
                const newAdditionalItems = [...orderItems];
                newAdditionalItems.splice(index, 1);
                setOrderItems(newAdditionalItems);
              }}
              totalItems={orderItems.length}
              onUpdate={updateOrderItem}
            />
          ))}

          <Button
            size="xs"
            className="rounded-full w-full"
            onClick={() => addOrderItem()}
          >
            Add Item
          </Button>
          <Button
            size="xs"
            className="rounded-full w-full"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button size="xs" className="bg-gray-500 rounded-full w-full">
            Back
          </Button>
        </div>
      </Card>
    </>
  );
};

export default EditOrder;
