import { FaMobileRetro } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Accordion, Button, Card, Label, TextInput } from "flowbite-react";
import moment from "moment";
import config from "../../config";
import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../../app/feature/productSlice";
import { UserType } from "@repo/ui/enums/user";
import {
  IDispatchOrderRequestBody,
  IOrder,
  IOrderItem,
} from "@repo/ui/types/order";
import {
  fetchDispatchOrder,
  fetchWpOrders,
} from "../../app/feature/orderSlice";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import Loader from "../common/Loader/Loader";

interface IFilteredProductSize {
  size: string;
  avl_qty: number;
  pack_qty: number;
  dispatch_qty: number;
  rack_no: string;
  quantity: number;
  comment: string;
}

interface IFilteredProduct {
  color: string;
  code: string;
  name: string;
  sizes: IFilteredProductSize[];
}

const OrderDescription: React.FC<{
  order: IOrder;
  orderIndex: number;
  dispatchQty: number;
  packQty: number;
  totalQty: number;
}> = ({ order, orderIndex, dispatchQty, packQty, totalQty }) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div>
      <div className="flex gap-2 items-center">
        <div className="w-[30px] h-[30px] rounded-full bg-[#0071AB] text-white flex justify-center items-center">
          {orderIndex + 1}
        </div>
        <p>{order.shop_name}</p>
      </div>
      <div className="flex gap-2 items-center">
        <p>
          +{order.isd}
          {order.mobile}
        </p>
        <a
          href={`tel:+${order.isd}${order.mobile}`}
          className="w-[30px] h-[30px] rounded-full bg-green-500 text-white flex justify-center items-center"
        >
          <FaMobileRetro />
        </a>
      </div>
      <p>Order ID: {order.order_id}</p>
      <p>Order Date: {moment(order.created_at).format(config.date.format)}</p>
      <p>City: {order.city}</p>
      <p>Comment: {order.remark}</p>
      <hr className="my-5" />
      <p>Warehouse: Dispatched Items / Packed Items / Ordered Items</p>
      {order.warehouse_status?.map(
        ({ warehouse, dispatch_qty, pack_qty, qty }) => (
          <p key={warehouse}>
            {warehouse}: {dispatch_qty} / {pack_qty} / {qty}
          </p>
        ),
      )}
      <div className="flex gap-2 items-center">
        <p>Items Dispatched: </p>
        <button className=" rounded-full bg-[#0071AB] text-white flex justify-center items-center p-2 py-1">
          <span className="me-2">{dispatchQty}</span>/ {totalQty}
        </button>
      </div>
      {user?.type === UserType.PACKAGER && (
        <div className="flex gap-2 items-center">
          <p>Items Packed: </p>
          <button className=" rounded-full bg-[#0071AB] text-white flex justify-center items-center p-2 py-1">
            <span className="me-2">{packQty}</span>/ {totalQty}
          </button>
        </div>
      )}
    </div>
  );
};

const ProductSize: React.FC<{
  onDispatchQtyChange: (
    code: string,
    color: string,
    size: string,
    dispatch_qty: number,
  ) => void;
  item: IFilteredProduct;
  size: IFilteredProductSize;
  itemIndex: number;
}> = ({ onDispatchQtyChange, item, size, itemIndex }) => {
  const [dispatchQty, setDispatchQty] = useState(size.dispatch_qty);

  const handleDispatchQtyChange = (dispatchQty: number) => {
    onDispatchQtyChange(item.code, item.color, size.size, dispatchQty);
    setDispatchQty(dispatchQty);
  };

  return (
    <div>
      <div>
        <strong>Size: {size.size}</strong>
      </div>
      <div className="bg-green-500 text-white">
        <strong>Available Qty: {size.avl_qty}</strong>
      </div>
      <div>
        <strong>Packed Qty: {size.pack_qty}</strong>
      </div>
      <div>
        <strong>Dispatched Qty: {size.dispatch_qty}</strong>
      </div>
      <div className="bg-red-600 text-white">
        <strong>Order Qty: {size.quantity}</strong>
      </div>
      <div>
        <strong>Rack No.: {size.rack_no}</strong>
      </div>
      <div>
        <strong>Comment: {size.comment}</strong>
      </div>
      <div>
        <input
          type="hidden"
          name={`items[${itemIndex}][name]`}
          value={item.name}
        />
        <input
          type="hidden"
          name={`items[${itemIndex}][color]`}
          value={item.color}
        />
        <input
          type="hidden"
          name={`items[${itemIndex}][code]`}
          value={item.code}
        />
        <input
          type="hidden"
          name={`items[${itemIndex}][size]`}
          value={size.size}
        />
        <Button.Group outline>
          <Button size="sm" onClick={() => handleDispatchQtyChange(0)}>
            None
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (dispatchQty === 0) return;
              handleDispatchQtyChange(Number(dispatchQty) - 1);
            }}
          >
            -
          </Button>
          <TextInput
            type="number"
            name={`items[${itemIndex}][dispatch_qty]`}
            placeholder="Dispatch Quantity"
            className="text-center w-20 rounded-none"
            onChange={(e) => handleDispatchQtyChange(Number(e.target.value))}
            value={dispatchQty}
          />
          <Button
            size="sm"
            onClick={() => handleDispatchQtyChange(Number(dispatchQty) + 1)}
          >
            +
          </Button>
          <Button
            size="sm"
            onClick={() => handleDispatchQtyChange(Number(size.quantity))}
          >
            All
          </Button>
        </Button.Group>
      </div>
    </div>
  );
};

const OrderContent: React.FC<{
  orderItems: IOrderItem[];
  groupedItems: IFilteredProduct[];
  order: IOrder;
}> = ({ orderItems, groupedItems, order }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const products = useAppSelector((state) => state.products.products);
  const dispatchLoading = useAppSelector(
    (state) => state.orders.dispatchLoading,
  );
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState<IDispatchOrderRequestBody>({
    items: [],
    remark: "",
  });

  // Create a useEffect to set the formData when orderItems change
  useEffect(() => {
    setFormData({
      items: orderItems
        .map((item) => {
          const product = products.find(
            (product) =>
              product.code === item.code &&
              product.color === item.color &&
              product.size === item.size,
          );

          let dispatch_qty = 0;

          if (user?.type === UserType.PACKAGER) {
            dispatch_qty = item.dispatch_qty;
          }

          if (product) {
            return {
              name: product.name,
              code: item.code,
              color: item.color,
              size: item.size,
              dispatch_qty,
            };
          } else {
            return {
              name: "",
              code: item.code,
              color: item.color,
              size: item.size,
              dispatch_qty,
            };
          }
        })
        .filter((item) => item.name !== ""),
      remark: "",
    });
  }, [orderItems, products, user]);

  const handleDispatchQtyChange = (
    code: string,
    color: string,
    size: string,
    dispatch_qty: number,
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      items: prevFormData.items.map((item) => {
        if (item.code === code && item.color === color && item.size === size) {
          return {
            ...item,
            dispatch_qty,
          };
        }
        return item;
      }),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const formData = new FormData(e.currentTarget);

    await dispatch(
      fetchDispatchOrder({
        id: String(order._id),
        data: formData,
      }),
    );
  };

  const getTotalQty = (groupedItems: IFilteredProduct[]) => {
    let totalQty = 0;

    for (const itemGroup of groupedItems) {
      for (const size of itemGroup.sizes) {
        totalQty += size.quantity;
      }
    }

    return totalQty;
  };

  let i = 0;
  return (
    <>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <TextInput
          type="text"
          placeholder="Search Items"
          onChange={(e) => setSearch(e.target.value)}
        />

        {groupedItems.map((itemGroup, groupIndex) => {
          const lowerCaseSearch = search.toLowerCase();
          const showProduct =
            itemGroup.name.toLowerCase().includes(lowerCaseSearch) ||
            itemGroup.color.includes(lowerCaseSearch) ||
            itemGroup.sizes.some((size) =>
              size.size.toLowerCase().includes(lowerCaseSearch),
            );
          return (
            <div
              key={`${itemGroup.code}-${itemGroup.color}`}
              className={`${showProduct ? "" : "hidden "}mt-5 mb-4`}
            >
              <div className="item-detail-wrapper">
                <p>
                  {groupIndex + 1}/{groupedItems.length}
                </p>
                <div>
                  <strong>Name: {itemGroup.name}</strong>
                </div>
                <div>
                  <strong>Color: {itemGroup.color}</strong>
                </div>
              </div>
              <div className="size-wrapper grid grid-cols-1 gap-2 border-b-2 pb-4">
                {itemGroup.sizes.map((size) => {
                  return (
                    <ProductSize
                      key={`${itemGroup.code}-${itemGroup.color}-${size.size}`}
                      onDispatchQtyChange={handleDispatchQtyChange}
                      item={itemGroup}
                      itemIndex={i++}
                      size={size}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        <div id="fileUpload" className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor={`file-${order._id}`} value="Upload file" />
          </div>
          <input
            type="file"
            className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
            id={`file-${order._id}`}
            accept="image/*"
            name="image"
            required={formData.items.some((item) => item.dispatch_qty > 0)}
            capture="environment"
          />
        </div>
        <TextInput
          className="mt-2"
          placeholder="Comment"
          name="remark"
          id={`remark-${order._id}`}
        />
        <hr className="my-3" />
        <button
          disabled={dispatchLoading}
          type="submit"
          className="w-full rounded-full bg-[#0071AB] text-center text-white p-1"
        >
          {dispatchLoading
            ? "Loading..."
            : `Save & ${user?.type === UserType.PACKAGER ? "Pack" : "Dispatch"}`}
        </button>
      </form>
      <div
        className="dispatch-details-container bg-[#0071AB] p-2 rounded-lg text-white"
        style={{
          position: "fixed",
          right: 10,
          bottom: 10,
        }}
      >
        <p>
          Current Dispatch Items:{" "}
          {formData.items.reduce((acc, item) => acc + item.dispatch_qty, 0)} /{" "}
          {getTotalQty(groupedItems)}
        </p>
        <Button
          type="button"
          size="xs"
          pill
          className="bg-red-500 w-full"
          onClick={() => {
            // Close the accordion
            const panel = document.querySelector<HTMLButtonElement>(
              `button#accordion-title-${order._id}`,
            );
            if (panel) {
              panel.click();
            }
          }}
        >
          Close
        </Button>
      </div>
    </>
  );
};

const OrderCards = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.products,
  );
  const { user } = useAppSelector((state) => state.auth);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchWpOrders({}))
      .unwrap()
      .then((response) => {
        // Extract product codes from orders
        const codes: string[] = [];
        for (const order of response) {
          for (const item of order.items) {
            if (!codes.includes(item.code)) {
              codes.push(item.code);
            }
          }
        }
        dispatch(fetchProducts({ codes }));
      });
  }, []);

  const getProductsWithSizes = (items: IOrderItem[]) => {
    const returnProducts: IFilteredProduct[] = []; // [{color: "test", code: "test", name: "test", sizes: []}]

    for (const item of items) {
      const { color, code, size } = item;
      const filteredIndex = returnProducts.findIndex(
        (product) => product.code === item.code && product.color === item.color,
      );
      const product = filteredProducts.find(
        (product) =>
          product.code === code &&
          product.color === color &&
          product.size === size,
      );

      if (product) {
        const newSize = {
          size,
          avl_qty: product.quantity,
          pack_qty: item.pack_qty,
          dispatch_qty: item.dispatch_qty,
          quantity: item.qty,
          rack_no: product.rack_no,
          comment: item.comment,
        };

        if (filteredIndex === -1) {
          returnProducts.push({
            name: product.name,
            color,
            code,
            sizes: [newSize],
          });
        } else {
          returnProducts[filteredIndex].sizes.push(newSize);
        }
      }
    }
    return returnProducts;
  };

  const filteredProducts = useMemo(() => {
    if (user?.type === UserType.PACKAGER) return products;
    const filteredProducts = products.filter((product) =>
      user?.warehouses.includes(product.rack_no),
    );
    return filteredProducts;
  }, [products, user]);

  const filteredOrders = useMemo(() => {
    if (search === "") {
      return orders;
    } else {
      const lowerCaseSearch = search.toLowerCase();
      const ordersFilteredBySearch = orders.filter((order) => {
        return (
          order.order_id.toLowerCase().includes(lowerCaseSearch) ||
          order.shop_name.toLowerCase().includes(lowerCaseSearch) ||
          order.city.toLowerCase().includes(lowerCaseSearch)
        );
      });
      if (user?.type === UserType.PACKAGER) return ordersFilteredBySearch;
      const ordersToShow = ordersFilteredBySearch.filter(
        (order) => getProductsWithSizes(order.items).length > 0,
      );
      return ordersToShow;
    }
  }, [orders, user, search]);

  if (loading) return <Loader />;

  return (
    <>
      <Card className="card mb-4">
        <div className="card-body">
          <div className="card-title">
            <p className="text-[#000] mb-3 text-capitalize font-bold">Orders</p>
            <p className=" font-normal text-[#76838f] text-[0.875rem] mb-3">
              List of orders
            </p>
          </div>
          <div className="mb-4">
            <Link
              to={dashboardRoutes.order.wpLogs}
              className="bg-[#0071AB] text-white px-4 rounded-full pb-2 pt-1"
            >
              Logs
            </Link>
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              placeholder="Search Order"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>
      <Accordion collapseAll>
        {filteredOrders.map((order, orderIndex) => {
          const groupedItems = getProductsWithSizes(order.items);

          let totalQty = 0;
          let dispatchQty = 0;
          let packQty = 0;

          for (const item of order.items) {
            totalQty += Number(item.qty);
            dispatchQty += Number(item.dispatch_qty);
            packQty += Number(item.pack_qty);
          }

          return (
            <Accordion.Panel key={order._id}>
              <Card className="mb-4">
                <Accordion.Title id={`accordion-title-${order._id}`}>
                  <OrderDescription
                    order={order}
                    orderIndex={orderIndex}
                    totalQty={totalQty}
                    dispatchQty={dispatchQty}
                    packQty={packQty}
                  />
                </Accordion.Title>
                <Accordion.Content>
                  <div className="grid">
                    <div className="flex gap-2 ms-auto me-auto mb-4">
                      <Link
                        to={dashboardRoutes.order.edit.replace(
                          ":id",
                          String(order._id),
                        )}
                        className="bg-[#0071AB] px-3 py-1 text-white rounded-full"
                      >
                        Edit items
                      </Link>
                      <Link
                        to={""}
                        className="bg-[#0071AB] px-3 py-1 text-white rounded-full"
                      >
                        Dispatch History
                      </Link>
                    </div>
                  </div>
                  {productsLoading ? (
                    <Loader />
                  ) : (
                    <OrderContent
                      orderItems={order.items}
                      groupedItems={groupedItems}
                      order={order}
                    />
                  )}
                </Accordion.Content>
              </Card>
            </Accordion.Panel>
          );
        })}
      </Accordion>
    </>
  );
};

export default OrderCards;
