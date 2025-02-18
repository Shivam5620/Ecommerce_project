import { Accordion, Card } from "flowbite-react";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import DataTable, { TableColumn } from "react-data-table-component";
import { fetchOrderById } from "../../../app/feature/orderSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import moment from "moment";
import config from "../../../config";
import { fetchProducts } from "../../../app/feature/productSlice";
import { getAssetUrl } from "../../../lib/asset";
import { UploadType } from "@repo/ui/enums/upload";
import { UserType } from "@repo/ui/enums/user";
import { IBilty } from "@repo/ui/types/bilty";

interface IOrderDispatchLogItem {
  name: string;
  code: string;
  color: string;
  size: string;
  qty: number;
  current_dispatch_qty?: number;
  total_dispatch_qty: number;
  total_pack_qty: number;
}

interface IOrderDispatchLog
  extends Pick<
    IOrderDispatch,
    "dispatch_id" | "dispatched_by" | "image" | "created_at"
  > {
  noOfPairs: number;
  items: IOrderDispatchLogItem[];
  bilty: IBilty;
}

const SingleOrderLog = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const order = useAppSelector((state) =>
    state?.orders?.orders?.find((order) => order._id === id),
  );

  const products = useAppSelector((state) => state.products.products);
  const productsLoading = useAppSelector((state) => state.products.loading);

  const orderItems = useMemo<IOrderDispatchLogItem[]>(() => {
    const returnOrderItems: IOrderDispatchLogItem[] = [];
    console.log("Calling useMemo for orderItems", order, products);

    if (order && Array.isArray(order.items)) {
      for (const orderItem of order.items) {
        const product = products.find(
          (product) =>
            product.code === orderItem.code &&
            product.color === orderItem.color &&
            product.size === orderItem.size,
        );

        if (product) {
          returnOrderItems.push({
            name: product.name,
            code: product.code,
            color: product.color,
            size: product.size,
            qty: Number(orderItem.qty),
            total_dispatch_qty: Number(orderItem.dispatch_qty),
            total_pack_qty: Number(orderItem.pack_qty),
          });
        }
      }
    }

    return returnOrderItems;
  }, [order, products]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id))
        .unwrap()
        .then((order) => {
          if (order) {
            const codes = Array.from(
              new Set(order.items.map((item) => item.code)),
            );

            dispatch(fetchProducts({ codes }));
          }
        });
    }
  }, [id, dispatch]);

  const orderDispatchLogs: IOrderDispatchLog[] = useMemo(() => {
    if (order && Array.isArray(order.dispatches)) {
      /**
       * { [code]: { [color]: { [size]: { dispatch_qty: 0, pack_qty: 0 }} } }
       */
      const qtyMapper: Record<
        string,
        Record<
          string,
          Record<
            string,
            {
              dispatch_qty: number;
              pack_qty: number;
            }
          >
        >
      > = {};
      return order.dispatches.map((dispatch) => {
        return {
          dispatch_id: dispatch.dispatch_id,
          dispatched_by: dispatch.dispatched_by,
          image: dispatch.image,
          created_at: dispatch.created_at,
          noOfPairs: dispatch.items.reduce(
            (sum, item) => sum + item.dispatch_qty,
            0,
          ),
          bilty: dispatch.bilty,
          items: dispatch.items.map((item) => {
            if (!qtyMapper[item.code]) qtyMapper[item.code] = {};
            if (!qtyMapper[item.code][item.color])
              qtyMapper[item.code][item.color] = {};
            if (!qtyMapper[item.code][item.color][item.size])
              qtyMapper[item.code][item.color][item.size] = {
                dispatch_qty: 0,
                pack_qty: 0,
              };

            if (dispatch.dispatched_by == UserType.PACKAGER) {
              qtyMapper[item.code][item.color][item.size].pack_qty += Number(
                item.dispatch_qty,
              );
            } else if (dispatch.dispatched_by == UserType.WAREHOUSEMANAGER) {
              qtyMapper[item.code][item.color][item.size].dispatch_qty +=
                Number(item.dispatch_qty);
            }

            const orderItem = order.items.find(
              (orderItem) =>
                orderItem.code === item.code &&
                orderItem.color === item.color &&
                orderItem.size === item.size,
            );

            const qty = orderItem ? orderItem.qty : 0;

            const product = products.find(
              (product) =>
                product.code === item.code &&
                product.color === item.color &&
                product.size === item.size,
            );

            return {
              name: product?.name || "-",
              code: item.code,
              color: item.color,
              size: item.size,
              qty,
              current_dispatch_qty: item.dispatch_qty,
              total_dispatch_qty:
                qtyMapper[item.code][item.color][item.size]["dispatch_qty"],
              total_pack_qty:
                qtyMapper[item.code][item.color][item.size]["pack_qty"],
            };
          }),
        };
      });
    }

    return [];
  }, [order, products]);

  const getCardBgColor = (dispatch: IOrderDispatchLog): string => {
    switch (dispatch.dispatched_by) {
      case UserType.WAREHOUSEMANAGER:
        return "bg-yellow-300";
      case UserType.PACKAGER:
        return "bg-green-400";
      default:
        return "";
    }
  };

  const orderColumns: TableColumn<IOrderDispatchLogItem>[] = [
    { name: "Name", selector: (row) => row.name || "N/A" },
    { name: "Code", selector: (row) => row.code || "N/A" },
    { name: "Color", selector: (row) => row.color || "N/A" },
    { name: "Size", selector: (row) => row.size || "N/A" },
    { name: "Order Qty", selector: (row) => row.qty.toString() || "0" },
    {
      name: "Total Dispatch Qty",
      selector: (row) => row.total_dispatch_qty.toString() || "0",
    },
    {
      name: "Total Pack Qty",
      selector: (row) => row.total_pack_qty.toString() || "0",
    },
  ];

  const dispatchColumns: TableColumn<IOrderDispatchLogItem>[] = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Code", selector: (row) => row.code, sortable: true },
    { name: "Color", selector: (row) => row.color, sortable: true },
    { name: "Size", selector: (row) => row.size, sortable: true },
    {
      name: "Current Dispatch Qty",
      selector: (row) => row.current_dispatch_qty ?? 0,
      sortable: true,
    },
    {
      name: "Order Qty",
      selector: (row) => row.qty,
      sortable: true,
    },
    {
      name: "Dispatch Qty",
      selector: (row) => row.total_dispatch_qty,
      sortable: true,
    },
    {
      name: "Pack Qty",
      selector: (row) => row.total_pack_qty,
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card className="my-4">
        <h1 className="text-2xl font-bold mb-4">Order Logs</h1>
        <p className="mb-6">You can find complete order logs here</p>
      </Card>

      <Card className="my-6">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        {order ? (
          <>
            <p>
              <strong>Order ID: </strong> {order.order_id}
            </p>
            <p>
              <strong>Order Date: </strong>{" "}
              {moment(order.created_at).format(config.date.format)}
            </p>
            <p>
              <strong>Shop Name: </strong>
              {order.shop_name}
            </p>
            <p>
              <strong>Mobile: </strong> {order.mobile}
            </p>
            <p>
              <strong>No. of Items:</strong>{" "}
              {Array.isArray(order.items)
                ? order.items.reduce((a, b) => Number(a) + Number(b.qty), 0)
                : 0}
            </p>
            <DataTable
              columns={orderColumns}
              progressPending={productsLoading}
              data={orderItems}
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Card>

      <Accordion>
        {orderDispatchLogs.map((dispatch) => (
          <Accordion.Panel key={dispatch.dispatch_id}>
            <Accordion.Title
              className={`${getCardBgColor(dispatch)} p-4 text-black`}
            >
              <div>
                <p>
                  <strong>Dispatch ID:</strong> {dispatch.dispatch_id}
                </p>
                <p>
                  <strong>Dispatched By:</strong> {dispatch.dispatched_by}
                </p>
                <p>
                  <strong>Dispatch Date:</strong>{" "}
                  {moment(dispatch.created_at).format(config.date.format)}
                </p>
                <p>
                  <strong>No. of Pairs:</strong>{" "}
                  {dispatch.items.reduce(
                    (a, b) => Number(a) + Number(b.qty),
                    0,
                  )}
                </p>
              </div>
            </Accordion.Title>
            <Accordion.Content className="p-0">
              <img
                src={getAssetUrl(
                  UploadType.dispatch,
                  dispatch.image ?? "NotFound.png",
                )}
                onError={(e) => {
                  e.currentTarget.src = "/NotFound.png";
                }}
                alt="Dispatch Image"
              />
              {dispatch.bilty?.image ? (
                <img
                  src={getAssetUrl(
                    UploadType.bilty,
                    dispatch.bilty.image ?? "NotFound.png",
                  )}
                  onError={(e) => {
                    e.currentTarget.src = "/NotFound.png";
                  }}
                  alt="Dispatch Image"
                />
              ) : null}
              <DataTable
                columns={dispatchColumns}
                data={dispatch.items}
                progressPending={productsLoading}
                noDataComponent={<p>No items in this dispatch</p>}
              />
            </Accordion.Content>
          </Accordion.Panel>
        ))}
      </Accordion>
    </div>
  );
};

export default SingleOrderLog;
