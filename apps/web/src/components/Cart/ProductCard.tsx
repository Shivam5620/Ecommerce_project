import React from "react";
import Vector from "../../assets/images/Vector 7.png";
import Plus from "../../assets/images/Group 481903.png";
import Cross from "../../assets/images/cross.png";
import { ICartItem } from "@repo/ui/types/cart";
import { useAppDispatch } from "../../app/hooks";
// import ShoesCard from '../../assets/images/Shoes.png';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  updateCartItem,
} from "../../app/features/cartSlice";
import { getDiscountedPrice } from "@repo/ui/utils/cart";
import { getAssetUrl } from "../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import { priceFormat } from "@repo/ui/utils/number";

interface IProps {
  item: ICartItem;
}

const ProductCard: React.FC<IProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const discountedPrice = getDiscountedPrice(item.sale_price, item.discount);

  return (
    <div className="card border border-[#0000001F] rounded-[19px] p-2 lg:p-4 mb-2 bg-white">
      <div className="flex justify-between items-center pb-4">
        <img
          className="cart-image"
          src={getAssetUrl(UploadType.product, item.image)}
          alt={item.name}
          width="20%"
        />
        <div>
          <p className="font-bold card-title text-[12px] sm:text-[18px]">
            {item.name}
          </p>
          <div className="flex gap-5">
            <span className="text-[#8B8B8B] card-title text-[12px] sm:text-[18px]">
              Color <b className="text-[#494949] font-semibold">{item.color}</b>
            </span>
            <span className="text-[#8B8B8B] card-title text-[12px] sm:text-[18px]">
              MOQ <b className="text-[#494949] font-semibold">{item.MOQ}</b>
            </span>
          </div>
        </div>
        <div>
          <p className="font-bold  text-black card-title text-[12px] sm:text-[18px]">
            {item.discount > 0 ? (
              <>
                <span className="line-through text-[#494949]">
                  {priceFormat(item.sale_price)}
                </span>
                &nbsp; {priceFormat(discountedPrice)}
                <br />
                {item.discount ? (
                  <span className="text-[#008000]">{item.discount}% off</span>
                ) : null}
              </>
            ) : (
              priceFormat(item.sale_price)
            )}
          </p>
        </div>
      </div>
      {item.sizes.map(({ size, quantity }) => {
        if (quantity === 0) return null;
        return (
          <div key={size} className="bg-[#F4F4F4] rounded-[8px] p-1 mb-1">
            <div className="flex justify-between items-center gap-4">
              <div className="grid grid-cols-3 lg:gap-14 gap-2 items-center w-full">
                <p className="font-semibold lg:text-[20px] text-[#494949] cart-main-text text-[12px] sm:text-[18px]">
                  {size}
                </p>
                <div className="grid grid-cols-3 items-center gap-3">
                  <div className="quantity-btn-end">
                    <button
                      className="h-[23px] w-[23px] rounded-full bg-[#DFDFDF] text-black flex justify-center items-center"
                      onClick={() =>
                        dispatch(
                          decreaseQuantity({
                            code: item.code,
                            color: item.color,
                            size,
                          }),
                        )
                      }
                    >
                      <img src={Vector} alt="Decrease Quantity" />
                    </button>
                  </div>
                  <p className="font-semibold lg:text-[18px] text-[#494949] cart-main-text text-center text-[12px] sm:text-[18px]">
                    {quantity}
                  </p>
                  <div className="quantity-btn-left">
                    <button
                      className="h-[23px] w-[23px] rounded-full bg-[#DFDFDF] text-black flex justify-center items-center"
                      onClick={() =>
                        dispatch(
                          increaseQuantity({
                            code: item.code,
                            color: item.color,
                            size,
                          }),
                        )
                      }
                    >
                      <img src={Plus} alt="Increase Quantity" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold lg:text-[20px] text-[#494949] cart-main-text text-end text-[12px] sm:text-[18px]">
                  {priceFormat(quantity * discountedPrice)}
                </p>
              </div>
              <div>
                <button
                  className="w-[23px] h-[23px] rounded-full bg-[#E10000] flex justify-center items-center"
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        code: item.code,
                        color: item.color,
                        size,
                      }),
                    )
                  }
                >
                  <img src={Cross} alt="Remove" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div>
        {/* <p className="font-semibold text-[12px] text-[#494949] pb-3">
          Enter Your Comments
        </p>
        <textarea className="border w-full outline-none" /> */}

        {/* <label
          htmlFor="message"
          className="font-semibold text-[12px] text-[#494949] pb-3"
        >
          Enter Your Comments
        </label> */}
        <textarea
          id="message"
          rows={1}
          className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Your Comments here..."
          value={item.comment}
          onChange={(e) => {
            dispatch(
              updateCartItem({
                ...item,
                comment: e.target.value,
              }),
            );
          }}
        />
      </div>
    </div>
  );
};

export default ProductCard;
