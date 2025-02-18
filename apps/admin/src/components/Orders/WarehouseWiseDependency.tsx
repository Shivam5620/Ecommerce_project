import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchWarehouses } from "../../app/feature/productSlice";
import DataTable, { TableColumn } from "react-data-table-component";
import Loader from "../common/Loader/Loader";
import { Card } from "flowbite-react";
import { OrderStatus } from "@repo/ui/enums/order";

interface IWarehouseDependency {
  warehouse: string;
  pendingOrders: number;
  noOfPairs: number;
}

const WarehouseWiseDependency = () => {
  const dispatch = useAppDispatch();
  const { warehouses, loading: wareHouseLoading } = useAppSelector(
    (state) => state.products,
  );
  const { orders, loading: ordersLoading } = useAppSelector(
    (state) => state.orders,
  );
  const [data, setData] = useState<IWarehouseDependency[]>([]);

  useEffect(() => {
    dispatch(fetchWarehouses({}));
  }, []);

  useEffect(() => {
    // Warehouse data should be generated like warehouseData[warehouse] = {warehouse: "F01", pendingOrders: 0, noOfPairs: 0}
    const warehouseData: Record<string, IWarehouseDependency> = {};

    // Loop through orders
    for (const order of orders) {
      if (
        [OrderStatus.UNDER_DISPATCH, OrderStatus.PARTIAL_DISPATCH].includes(
          order.status,
        )
      ) {
        if (!Array.isArray(order.warehouse_status)) continue;
        // Loop through warehouse_status
        for (const warehouse_status of order.warehouse_status) {
          // Check if order has any items of that warehouse
          const warehouse = warehouse_status.warehouse;
          if (!warehouseData[warehouse]) {
            warehouseData[warehouse] = {
              warehouse,
              pendingOrders: 0,
              noOfPairs: 0,
            };
          }
          if (warehouse_status.dispatched === false) {
            warehouseData[warehouse].pendingOrders++;
            warehouseData[warehouse].noOfPairs += warehouse_status.qty;
          }
        }
      }
    }

    setData(Object.values(warehouseData));
  }, [warehouses, orders]);

  const columns: TableColumn<IWarehouseDependency>[] = [
    { name: "Warehouse", selector: (row) => row.warehouse, wrap: true },
    {
      name: "Pending Orders",
      selector: (row) => row.pendingOrders,
      wrap: true,
    },
    { name: "No. Of Pairs", selector: (row) => row.noOfPairs, wrap: true },
  ];

  return (
    <Card className="mb-3">
      <div className="card-body">
        <DataTable
          title="Warehouse wise dependency"
          columns={columns}
          data={data}
          noContextMenu={false}
          progressPending={wareHouseLoading || ordersLoading}
          progressComponent={<Loader />}
        />
      </div>
    </Card>
  );
};

export default WarehouseWiseDependency;
