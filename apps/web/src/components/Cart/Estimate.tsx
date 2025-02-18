import { IProductSize } from "@repo/ui/types/product";
import { calculateCartTotals, getDiscountedPrice } from "@repo/ui/utils/cart";
import { priceFormat } from "@repo/ui/utils/number";
import React from "react";

interface IProps {
  items: {
    name: string;
    sale_price: number;
    discount: number;
    sizes: IProductSize[];
    code: string;
    color: string;
  }[];
}

const Estimate: React.FC<IProps> = ({ items }) => {
  const { totalAmount, totalQty } = calculateCartTotals(items);

  return (
    <div className="card rounded-[19px] bg-white lg:p-4 p-2 pb-10 relative border mb-2">
      <div className="text-center">
        <h3 className="text-[18px] font-semibold pb-7">Estimate</h3>
      </div>
      {items.map((item) => {
        let itemQty = 0;
        let itemTotal = 0;
        const discountedPrice = getDiscountedPrice(
          Number(item.sale_price),
          item.discount,
        );
        item.sizes.forEach((size) => {
          itemTotal += size.quantity * discountedPrice;
          itemQty += size.quantity;
        });
        return (
          <div
            key={item.code + "-" + item.color}
            className="grid grid-cols-2 justify-between py-2 px-2 gap-4 bg-[#F4F4F4] rounded-[8px] mb-4"
          >
            <div className="grid grid-cols-2 lg:gap-10 gap-5 items-center">
              <p className="card-title text-[10px] sm:text-[15px]">
                {item.name}
              </p>
              <p className="card-title text-[10px] sm:text-[15px]">
                {item.name} <br />
                {/* 6X10 */}({item.code})
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 items-center">
              <p className="card-title text-[10px] sm:text-[15px]">
                {itemQty}({discountedPrice})
              </p>
              <p className="font-bold card-title text-[10px] sm:text-[15px]">
                {priceFormat(itemTotal)}
              </p>
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-2 justify-between py-2 gap-4 rounded-[8px] pb-10">
        <div className="flex gap-10 items-center justify-around">
          <p className="font-bold">Total</p>
          <p> </p>
        </div>
        <div className="flex gap-10 items-center justify-around">
          <p className="font-bold">{totalQty}P</p>
          <p className="font-bold">{priceFormat(totalAmount)}</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="pb-2">
        <p className="font-medium text-[10px] text-[#5F5F5F] pb-3">
          Terms & Conditions :-
        </p>
        <p className="font-medium text-[10px] text-[#5F5F5F] ">
          1. GST inclusive.
        </p>
        <p className="font-medium text-[10px] text-[#5F5F5F] ">
          2. Order will be dispatched upon stock availability.
        </p>
        <p className="font-medium text-[10px] text-[#5F5F5F] ">
          3. Order will be confirmed upon bank confirmation.
        </p>
      </div>
    </div>
  );
};

export default Estimate;
