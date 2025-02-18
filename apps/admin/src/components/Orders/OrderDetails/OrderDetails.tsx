import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchOrderById } from "../../../app/feature/orderSlice";
import OrderInvoice from "./OrderInvoice";
import { Button, Card } from "flowbite-react";
import { useReactToPrint } from "react-to-print";

function OrderDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn: () => void = useReactToPrint({ contentRef });

  // Fetch the order from Redux store
  const order = useAppSelector((state) =>
    state.orders.orders.find((order) => order._id === id),
  );

  // Fetch the products from Redux store
  // const products = useAppSelector((state) => state.products.products);

  // Fetch order data and products on component mount
  useEffect(() => {
    if (id && id.length > 0) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  if (order) {
    return (
      <Card className="my-2">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Order {order.order_id}</p>
            <Button pill size="sm" onClick={reactToPrintFn}>
              Print
            </Button>
          </div>
          <div ref={contentRef}>
            <OrderInvoice
              invoice_id={order.order_id}
              party={order.customer?.name ?? ""}
              city={order.city}
              items={order.items}
              date={order.created_at}
              remark={order.remark}
              total={order.total}
              transport={order.transport_name}
              cartons={0}
              open_boxes={0}
              gst={order.customer?.gst_no ?? ""}
              isInvoice={false}
            />
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

export default OrderDetails;
