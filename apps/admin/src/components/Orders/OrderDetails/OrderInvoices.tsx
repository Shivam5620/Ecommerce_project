import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchOrderDispatches } from "../../../app/feature/orderDispatchSlice";
import OrderInvoice, { IInvoiceItem } from "./OrderInvoice";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import { Button, Card } from "flowbite-react";
import { useReactToPrint } from "react-to-print";
import "./orderInvoices.css";

const OrderInvoices = () => {
  const dispatch = useAppDispatch();
  const { dispatches } = useAppSelector((state) => state.dispatches);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn: () => void = useReactToPrint({ contentRef });

  // Get the invoice_ids from query
  const invoice_ids = new URLSearchParams(window.location.search).get(
    "invoice_ids",
  );
  console.log(invoice_ids);

  useEffect(() => {
    // Fetch the invoices
    if (invoice_ids) {
      dispatch(
        fetchOrderDispatches({
          dispatch_ids: invoice_ids.split(","),
        }),
      );
    }
  }, [invoice_ids]);

  const getDispatchItems = (orderDispatch: IOrderDispatch) => {
    const returnItems: IInvoiceItem[] = [];
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
          qty: Number(dispatchItem.dispatch_qty),
          total:
            Number(orderItem.sale_price) * Number(dispatchItem.dispatch_qty),
          name: dispatchItem.name,
          code: dispatchItem.code,
          color: dispatchItem.color,
          size: dispatchItem.size,
          discount_1: orderItem.discount_1,
          discount_2: orderItem.discount_2,
          discount_3: orderItem.discount_3,
          hsn_code: orderItem.hsn_code,
          sale_price: Number(orderItem.sale_price),
          price: Number(orderItem.price),
          cgst_percentage: orderItem.cgst_percentage,
          sgst_percentage: orderItem.sgst_percentage,
          igst_percentage: orderItem.igst_percentage,
        });
      }
    }
    return returnItems;
  };

  return (
    <Card className="my-2">
      <div className="card-body">
        <div className="flex justify-end items-center">
          <Button pill size="sm" onClick={reactToPrintFn}>
            Print
          </Button>
        </div>
        <div ref={contentRef}>
          {dispatches.map((orderDispatch, index) => {
            const items = getDispatchItems(orderDispatch);
            return (
              <>
                <OrderInvoice
                  key={orderDispatch.dispatch_id}
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
                {index !== dispatches.length - 1 && (
                  <div className="print-page-break"></div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default OrderInvoices;
