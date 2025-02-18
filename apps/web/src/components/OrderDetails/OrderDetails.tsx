import { FaCheck } from "react-icons/fa";
import { useAppSelector } from "../../app/hooks";
import Estimate from "../Cart/Estimate";
import { Link } from "react-router-dom";
import { routes } from "@repo/ui/lib/constants";
import { groupOrderProductsBySize } from "@repo/ui/lib/product";
import { useEffect, useRef } from "react";

const OrderDetails = () => {
  const order = useAppSelector((state) => state.orders.order);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  }, [downloadRef]);

  if (!order) {
    return <p>No order details found</p>;
  }

  return (
    <div className="w-full">
      <div className="bg-[#fff] py-[2.375rem] h-[100vh]">
        <div className="flex justify-center w-full mx-0">
          <div className="w-full mx-auto px-2 text-center">
            <p className="text-black font-sans font-semibold pb-4">
              Thank You!
            </p>
            <div className="bg-blue-500 p-3 w-full rounded-md mb-3">
              <div className="p-12 pb-6 flex justify-center">
                <div className="h-[50px] w-[50px] bg-white rounded-full text-green-600 text-[20px] flex justify-center items-center">
                  <FaCheck />
                </div>
              </div>
              <p className="text-slate-100 text-[14px]">
                Your Order has been placed successfully !
              </p>
              <p className="text-slate-100 text-[14px]">
                Your order ID is {order?.order_id}{" "}
              </p>
            </div>
            <div>
              <p className="text-center px-10 text-gray-700 text-[13px] pb-3">
                Delivery will be informed by SMS On Your Phone Number
              </p>
            </div>
            <div className="pb-3">
              <div className="flex justify-center">
                <a
                  className="block border border-[#009CC9] bg-blue-500 rounded-full text-center p-3 text-white mb-3"
                  href={`${import.meta.env.VITE_LEGACY_API_BASE_URL}/api/v1/download-order/${order?._id}`}
                  target="_blank"
                  ref={downloadRef}
                >
                  Download
                </a>
              </div>
              <div className="flex justify-center">
                <Link
                  to={routes.home}
                  className="block border border-[#009CC9] bg-blue-500 rounded-full text-center p-3 text-white"
                >
                  Back To Home
                </Link>
              </div>
            </div>
            <Estimate
              items={groupOrderProductsBySize(order?.items || []).map(
                (item) => ({
                  name: item.name ?? "",
                  sale_price: item.price,
                  discount: item.discount_1 ?? 0,
                  sizes: item.sizes,
                  code: item.code,
                  color: item.color,
                }),
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
