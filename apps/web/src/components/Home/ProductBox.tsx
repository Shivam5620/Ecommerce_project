import { IGroupedProduct } from "@repo/ui/types/product";
// import Shoes from "../../../assets/images/Shoes.png";
import { addToCart, removeFromCart } from "../../app/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cross from "../../assets/images/cross.png";
import { getDiscountedPrice } from "@repo/ui/utils/cart";
import { CartType } from "@repo/ui/enums/cart";
import { getAssetUrl } from "../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import { priceFormat } from "@repo/ui/utils/number";

interface IProps {
  product: IGroupedProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { items: cartItems, cartType } = useAppSelector((state) => state.cart);

  const existingCartItem = cartItems.find(
    (item) => item.code === product.code && item.color === product.color,
  );

  const getCartQuantity = (size: string) => {
    if (existingCartItem) {
      const sizeIndex = existingCartItem.sizes.findIndex(
        (item) => item.size === size,
      );
      if (sizeIndex !== -1 && existingCartItem.sizes[sizeIndex].quantity > 0) {
        return (
          <>
            <div className="absolute top-[-10px] right-[-10px] h-[22px] w-[22px] bg-[#00A5CC] rounded-full text-white flex justify-center items-center">
              {existingCartItem.sizes[sizeIndex].quantity}
            </div>
            <div
              className="absolute top-[-10px] left-[-10px] h-[22px] w-[22px] bg-red-600 rounded-full text-white flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();

                dispatch(
                  removeFromCart({
                    code: product.code,
                    color: product.color,
                    size: size,
                  }),
                );
              }}
            >
              <img src={Cross} alt="Remove" />
            </div>
          </>
        );
      }
    }
    return null;
  };

  const discountedPrice = getDiscountedPrice(
    product.sale_price,
    product.discount,
  );
  return (
    <div className="card-brand rounded-[27px] bg-white shadow-box  pb-5 mb-3">
      <img
        className="w-full rounded-[27px] pb-4"
        src={getAssetUrl(UploadType.product, product.image)}
        onError={(e) => {
          e.currentTarget.src = "/Logo.png";
        }}
        alt=""
      />
      <div className="p-3">
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold pb-2">
              {product.name}
              {/* <br /> */}({product.code})
            </p>
            <div className="flex gap-2">
              <p className="text-[11px] pb-1 font-semibold text-[#8B8B8B]">
                <b className="text-[11px] font-semibold text-[#494949]">
                  {/* Item name - Color - "MOQ" - Qty - Packing Qty */}
                  {product.color}
                  &nbsp;-&nbsp;MOQ&nbsp;-&nbsp;{product.MOQ}&nbsp;-&nbsp;
                  {product.PRCTN}
                </b>
                <br />
                <b className="text-[11px] font-semibold text-[#494949]">
                  {/* BRAND - CATEGORY - "PCODE" - CODE */}
                  {product.brand}&nbsp;-&nbsp;{product.category.join(", ")}
                  &nbsp;-&nbsp;PCODE&nbsp;-&nbsp;{product.product_code}
                </b>
              </p>
            </div>
            {/* <div className="flex gap-2">
              <p className="text-[11px] pb-1 font-semibold text-[#8B8B8B]">
                Categories{" "}
                <b className="text-[11px] font-semibold text-[#494949]">
                  {product.category.join(", ")}
                </b>
              </p>
              <p className="text-[11px] pb-1 font-semibold text-[#8B8B8B]">
                Brand{" "}
                <b className="text-[11px] font-semibold text-[#494949]">
                  {product.brand}
                </b>
              </p>
            </div>
            <div className="flex gap-2">
              <p className="text-[11px] pb-4 font-semibold text-[#8B8B8B]">
                Color{" "}
                <b className="text-[11px] font-semibold text-[#494949]">
                  {product.color}
                </b>
              </p>
              <p className="text-[11px] pb-4 font-semibold text-[#8B8B8B]">
                MOQ{" "}
                <b className="text-[11px] font-semibold text-[#494949]">
                  {product.MOQ}
                </b>
              </p>
              <p className="text-[11px] pb-4 font-semibold text-[#8B8B8B]">
                Product Code{" "}
                <b className="text-[11px] font-semibold text-[#494949]">
                  {product.product_code}
                </b>
              </p>
            </div> */}
          </div>
          <div>
            <div>
              {product.discount > 0 ? (
                <p className="font-bold text-black card-title">
                  <p className="text-end text-[16px]">
                    <span>{priceFormat(discountedPrice)}</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="line-through text-[#494949] text-[12px]">
                      {priceFormat(product.sale_price)}
                    </span>
                    <p className="text-[#008000] text-end whitespace-nowrap text-[12px]">
                      {product.discount}% off
                    </p>
                  </p>
                </p>
              ) : (
                <p className="font-bold text-black card-title text-[16px]">
                  <p className="flex gap-2">
                    <span>{priceFormat(product.sale_price)}</span>
                  </p>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="relative grid grid-cols-2 lg:grid-cols-3 gap-2">
          {product.sizes.map((size, index) => {
            const color = index % 2 === 0 ? "#009CC9" : "#009CC9"; // "#006DA5"

            return (
              <button
                key={size.size}
                className={`text-white text-center text-[11px] font-semibold relative bg-[${color}] rounded-md w-full p-3`}
                onClick={() => {
                  dispatch(
                    addToCart({
                      product,
                      size: size.size,
                      quantity:
                        cartType === CartType.CARTON
                          ? product.PRCTN
                          : product.MOQ,
                    }),
                  );
                }}
              >
                {size.size} ({size.quantity} P)
                {getCartQuantity(size.size)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
