import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Arrow_icon from "../../assets/images/Arrow.png";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProductCard from "./ProductCard";
import { calculateCartTotals } from "@repo/ui/utils/cart";
import { routes } from "@repo/ui/lib/constants";
import { CiSearch } from "react-icons/ci";
import {
  ICreateOrderItemRequestBody,
  ICreateOrderRequestBody,
} from "@repo/ui/types/order";
import { fetchAddOrder } from "../../app/features/orderSlice";
import {
  clearCart,
  expressAddToCart,
  setProductAvailability,
} from "../../app/features/cartSlice";
import Estimate from "./Estimate";
import { groupProductsBySize } from "@repo/ui/lib/product";
import { priceFormat } from "@repo/ui/utils/number";

const Cart = () => {
  const dispatch = useAppDispatch();
  const availability = useAppSelector(
    (state) => state.cart.productAvailability,
  );
  const products = useAppSelector((state) => state.products.products);
  const cartItems = useAppSelector((state) => state.cart.items);
  const loading = useAppSelector((state) => state.orders.loading);
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [formData, setFormData] = useState({
    shopName: "",
    mobile: "",
    city: "",
    remark: "",
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const orderItems: ICreateOrderItemRequestBody[] = [];
    for (const item of cartItems) {
      for (const size of item.sizes) {
        if (size.quantity > 0) {
          orderItems.push({
            size: size.size,
            qty: size.quantity,
            color: item.color,
            code: item.code,
            comment: item.comment,
          });
        }
      }
    }

    const orderData: ICreateOrderRequestBody = {
      shop_name: formData.shopName,
      remark: formData.remark,
      isd: 91,
      mobile: parseFloat(formData.mobile),
      city: formData.city,
      items: orderItems,
    };

    dispatch(fetchAddOrder(orderData))
      .then((response) => {
        if (response.payload) {
          navigate(routes.orderDetails);
          dispatch(clearCart());
        }
      })
      .catch((error) => {
        alert("ERROR: " + error.toString());
      });
  };

  const { totalAmount, totalQty } = calculateCartTotals(cartItems);

  return (
    <div className="bg-[#F6F6F6] lg:p-7 p-2 relative">
      <div className="flex gap-1 items-center">
        <Link className="text-left" to={routes.home}>
          <div className="h-[48px] w-[48px] rounded-full justify-center items-center flex bg-white shadow-2xl my-cart-circle">
            <img src={Arrow_icon} alt="Back" />
          </div>
        </Link>
        <div className="text-center flex justify-center ms-auto me-auto">
          <div className="relative flex justify-center gap-3 items-center bg-[white] rounded-full p-2 ps-4 pe-4  w-[250px] lg:w-[600px]">
            <CiSearch className="lg:w-[20px] lg:h-[20px] w-[15px] h-[15px]" />
            <input
              className="w-[100%] outline-none text-[12px] lg:text-lg"
              placeholder="Type Product Code..."
              type="number"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (search.length) {
                    // Get the product
                    const product = groupProductsBySize(
                      products.filter(
                        (product) =>
                          String(product.product_code) ===
                          e.currentTarget.value,
                      ),
                    ).find(
                      (product) =>
                        String(product.product_code) === e.currentTarget.value,
                    );
                    setSearch("");
                    if (product) {
                      dispatch(expressAddToCart({ product }));
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        <div
          className={`relative sm:w-14 w-10 sm:h-8 h-5 rounded-full cursor-pointer transition-colors duration-300 ${
            availability ? "bg-green-400" : "bg-gray-300"
          }`}
          onClick={() => dispatch(setProductAvailability(!availability))}
        >
          <div
            className={`absolute sm:left-1 left-0.5 sm:top-1 top-0.5 sm:w-6 w-4 sm:h-6 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out ${
              availability ? "sm:translate-x-6 translate-x-5" : ""
            }`}
          ></div>
        </div>
      </div>
      <div className="lg:p-6 p-2 min-h-screen rounded-2xl mb-8">
        {/* Search Container start */}

        {/* Search Container end */}
        {cartItems.length ? (
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              {cartItems.map((item) => (
                <ProductCard key={item.code + "-" + item.color} item={item} />
              ))}
            </div>
            <div>
              {/* Estimate Section start */}
              <Estimate items={cartItems} />
              {/* Estimate Section End */}

              <form onSubmit={handleSubmit}>
                {/* Billing Information start */}
                <div className="card rounded-[19px] bg-white p-4 border mb-16 sm:mb-2 md:mb-2 lg:mb-2">
                  <div className="text-center">
                    <h3 className="text-[18px] font-semibold pb-7">
                      Billing Information
                    </h3>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5 ">
                    <div>
                      <input
                        className="rounded-full px-3 w-full border p-2 bg-[#FCFCFC] outline-none"
                        placeholder="Shop Name *"
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    <div>
                      <input
                        className="rounded-full px-3 w-full border p-2 bg-[#FCFCFC] outline-none"
                        placeholder="Mobile Number *"
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    <div>
                      <input
                        className="rounded-full px-3 w-full border p-2 bg-[#FCFCFC] outline-none"
                        placeholder="City *"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                    <div>
                      <input
                        className="rounded-full px-3 w-full border p-2 bg-[#FCFCFC] outline-none"
                        placeholder="Remark"
                        type="text"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Billing Information end */}

                {/* Checkout Section Start*/}
                <div className="card rounded-[19px] fixed sm:relative right-0 left-0 bottom-0 bg-white checkout lg:p-10 p-5">
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 items-center">
                    <div className="sm:hidden">
                      <p className="text-[#797979] font-semibold">
                        Total Amount
                      </p>
                      <p className="font-bold">
                        {priceFormat(totalAmount)} ({totalQty}P)
                      </p>
                    </div>
                    {loading ? (
                      <button
                        disabled={true}
                        className="bg-[#009CC9] w-100 text-center text-white pt-[15px] pb-[15px] rounded-full lg:px-24 px-6 text-white flex justify-center items-center"
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="mr-2 animate-spin"
                          viewBox="0 0 1792 1792"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-[#009CC9] w-100 text-center pt-[15px] pb-[15px] rounded-full lg:px-24 px-6 text-white"
                      >
                        Checkout
                      </button>
                    )}
                  </div>
                </div>
                {/* Checkout Section End*/}
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center h-[50vh] flex items-center justify-center place-items-center">
            <div>
              <h1 className="pb-2">Oops! You cart is empty.....</h1>
              <Link to={routes.home}>
                <button className="bg-[#00A5D0] text-white px-3 py-2 rounded-lg">
                  Start Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
