import React from "react";
import { IOrder, IUpdateOrderItemRequestBody } from "@repo/ui/types/order";
import { Button } from "flowbite-react";

interface IProps {
  item: IUpdateOrderItemRequestBody;
  index: number;
  order: IOrder;
  onUpdateQty: (index: number, qty: number) => void;
}
const OrderItem: React.FC<IProps> = ({ item, index, order, onUpdateQty }) => {
  return (
    <div
      className="mb-8 lg:mb-2"
      key={`${item.code}-${item.color}-${item.size}`}
    >
      <h4>{`Order ${index + 1}/${order.items.length}`}</h4>
      <div className="grid lg:grid-cols-2 gap-2 mb-3">
        <div className="flex justify-between lg:justify-normal gap-2 items-center">
          <strong>Name:</strong>
          <p>{item.name}</p>
        </div>
        <div className="flex justify-between  gap-2 items-center lg:justify-end">
          <strong>Color:</strong>
          <p>{item.color}</p>
        </div>
        <div className="flex justify-between lg:justify-normal gap-2 items-center">
          <strong>Code:</strong>
          <p>{item.code}</p>
        </div>
        <div className="flex justify-between gap-2 items-center lg:justify-end">
          <strong>Size:</strong>
          <p>{item.size}</p>
        </div>
      </div>
      <Button.Group className="w-full flex justify-center">
        <Button
          className="text-white"
          onClick={() => {
            if (item.qty > 0) onUpdateQty(index, Number(item.qty) - 1);
          }}
        >
          -
        </Button>
        <Button color="gray">{item.qty}</Button>
        <Button
          className="text-white"
          onClick={() => onUpdateQty(index, Number(item.qty) + 1)}
        >
          +
        </Button>
      </Button.Group>
    </div>
  );
};

export default OrderItem;
