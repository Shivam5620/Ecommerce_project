import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import OrderInvoice, { IInvoiceItem } from "../OrderDetails/OrderInvoice";
import { fetchOrderDispatchById } from "../../../app/feature/orderDispatchSlice";
import { Button, Card } from "flowbite-react";
import { useReactToPrint } from "react-to-print";

const OrderDispatchDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const orderDispatch = useAppSelector((state) =>
    state.dispatches.dispatches.find((d) => d._id === id),
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn: () => void = useReactToPrint({ contentRef });

  useEffect(() => {
    if (id && id.length > 0) {
      dispatch(fetchOrderDispatchById(id));
    }
  }, [id, dispatch]);

  const items: IInvoiceItem[] = useMemo(() => {
    const returnItems: IInvoiceItem[] = [];
    if (orderDispatch) {
      const orderItems = orderDispatch.order?.items;
      for (const dispatchItem of orderDispatch.items) {
        const orderItem = orderItems.find(
          (i) =>
            i.code === dispatchItem.code &&
            i.size === dispatchItem.size &&
            i.color === dispatchItem.color,
        );
        if (orderItem) {
          returnItems.push({
            qty: dispatchItem.dispatch_qty,
            total: orderItem.sale_price * dispatchItem.dispatch_qty,
            name: dispatchItem.name,
            code: dispatchItem.code,
            color: dispatchItem.color,
            size: dispatchItem.size,
            discount_1: orderItem.discount_1,
            discount_2: orderItem.discount_2,
            discount_3: orderItem.discount_3,
            hsn_code: orderItem.hsn_code,
            sale_price: orderItem.sale_price,
            price: orderItem.price,
            cgst_percentage: orderItem.cgst_percentage,
            sgst_percentage: orderItem.sgst_percentage,
            igst_percentage: orderItem.igst_percentage,
          });
        }
      }
    }
    return returnItems;
  }, [orderDispatch]);

  if (orderDispatch) {
    return (
      <Card className="my-2">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              Order {orderDispatch.dispatch_id}
            </p>
            <Button pill size="sm" onClick={reactToPrintFn}>
              Print
            </Button>
          </div>
          <div ref={contentRef}>
            <OrderInvoice
              invoice_id={orderDispatch.dispatch_id}
              party={
                orderDispatch.order.customer?.name ??
                orderDispatch.order.shop_name
              }
              city={orderDispatch.order.city}
              items={items}
              date={orderDispatch.created_at}
              remark={orderDispatch.remark}
              total={items.reduce((acc, item) => acc + item.total, 0)}
              transport={orderDispatch.order.transport_name ?? "NA"}
              cartons={orderDispatch.cartons ?? 0}
              open_boxes={orderDispatch.open_boxes ?? 0}
              gst={orderDispatch.order.customer?.gst_no ?? ""}
              isInvoice={true}
            />
          </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default OrderDispatchDetails;
