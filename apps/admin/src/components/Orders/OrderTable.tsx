import DataTable, { TableColumn } from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import moment from "moment";
import config from "../../config";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";
import Select from "react-select";
import {
  fetchBatchOrders,
  fetchCancelOrders,
  fetchPaginatedOrders,
  fetchUpdateOrder,
} from "../../app/feature/orderSlice";
import {
  IBatchOrdersRequestBody,
  ICancelOrdersRequestBody,
  IOrder,
} from "@repo/ui/types/order";
import { ExcelHeader, generateExcel } from "../../lib/excel";
import { TfiMenu } from "react-icons/tfi";
import { AiFillEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import { getPermissions } from "@repo/ui/lib/permission";
import { Features, Modules } from "@repo/ui/enums/permission";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "../common/Loader/Loader";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { fetchAllCustomers } from "../../app/feature/customerSlice";
import { OrderStatus } from "@repo/ui/enums/order";
import { fetchSyncInvoices } from "../../app/services/orderDispatch";
import { RiDiscountPercentFill } from "react-icons/ri";

const OrderTable = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, pagination } = useAppSelector(
    (state) => state.orders,
  );
  const { customers, loading: loadingCustomers } = useAppSelector(
    (state) => state.customers,
  );
  const [selectedRows, setSelectedRows] = useState<IOrder[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>("created_at"); // Default sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const rolePermissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, []);

  useEffect(() => {
    dispatch(
      fetchPaginatedOrders({
        page: currentPage,
        limit: rowPerPage,
        search,
        select:
          "order_id batch_id warehouse_status customer_code customer shop_name mobile city total status created_at updated_at dispatches",
        sortField,
        sortOrder,
      }),
    );
  }, [dispatch, currentPage, rowPerPage, search, sortField, sortOrder]);

  const permissions = getPermissions(
    Modules.Order,
    Features.Order,
    rolePermissions,
  );

  // Toggle the state so React Data Table changes to clearSelectedRows are triggered
  const handleClearRows = () => setToggleClearRows(!toggledClearRows);

  const customerOptions = useMemo(() => {
    return customers.map((c) => ({ value: c.code, label: c.name }));
  }, [customers]);

  const columns: TableColumn<IOrder>[] = [
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2 justify-center items-center">
          <Link to={dashboardRoutes.order.log.replace(":id", row._id ?? "")}>
            <TfiMenu className="h-4 w-4" />
          </Link>
          <Link to={dashboardRoutes.order.edit.replace(":id", row._id ?? "")}>
            <AiFillEdit className="h-4 w-4" />
          </Link>
          {row.customer_code && (
            <Link
              to={dashboardRoutes.customer.discounts.replace(
                ":code",
                row.customer_code,
              )}
            >
              <RiDiscountPercentFill className="h-4 w-4" />
            </Link>
          )}
        </div>
      ),
      width: "5%",
      wrap: true,
    },
    {
      name: "Order Id",
      selector: (row) => row.order_id,
      sortable: true,
      sortField: "order_id",
      wrap: true,
      cell: (row) => (
        <Link
          to={dashboardRoutes.order.details.replace(":id", String(row._id))}
          className="text-blue-500"
        >
          {row.order_id}
        </Link>
      ),
    },
    {
      name: "FAWZ Name",
      selector: (row) => row.shop_name,
      wrap: true,
      sortable: true,
      sortField: "shop_name",
    },
    {
      name: "FAWZ City",
      selector: (row) => row.city,
      wrap: true,
      sortable: true,
      sortField: "city",
    },
    {
      name: "Busy Name",
      selector: (row) => row.customer?.name ?? "-",
      cell: (row) => {
        if (
          [
            OrderStatus.PENDING,
            OrderStatus.BATCHED,
            OrderStatus.UNDER_DISPATCH,
            OrderStatus.PARTIAL_DISPATCH,
            OrderStatus.UNDER_PACK,
          ].includes(row.status)
        ) {
          return (
            <Select
              className="w-full"
              options={customerOptions}
              defaultValue={customerOptions.find(
                (option) => option.value === row.customer?.code,
              )}
              onChange={(selectedOption) => {
                if (selectedOption?.value) {
                  dispatch(
                    fetchUpdateOrder({
                      id: row._id ?? "",
                      data: {
                        customer_code: selectedOption.value,
                      },
                    }),
                  );
                }
              }}
            />
          );
        } else {
          return row.customer?.name;
        }
      },
      width: "20%",
      wrap: true,
    },
    {
      name: "Grand Total",
      selector: (row) => row.total,
      wrap: true,
      sortable: true,
      sortField: "total",
    },
    {
      name: "Customer Mobile",
      selector: (row) => row.mobile,
      wrap: true,
      sortable: true,
      sortField: "mobile",
    },
    {
      name: "Package Ids",
      cell: (row: IOrder) => {
        return (
          <div>
            {row.dispatches?.map((dispatch) => (
              <div key={dispatch._id}>
                <Link
                  className="text-blue-500"
                  to={dashboardRoutes.order.dispatch.details.replace(
                    ":id",
                    dispatch._id ?? "",
                  )}
                >
                  {dispatch.dispatch_id}
                </Link>
                {dispatch.synced && (
                  <FaCheckCircle className="text-green-500 inline" />
                )}
              </div>
            ))}
          </div>
        );
      },
      wrap: true,
      sortField: "Package Ids",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      wrap: true,
      sortable: true,
      sortField: "status",
    },
    {
      name: "Created At",
      selector: (row) => moment(row.created_at).format(config.date.format),
      sortable: true,
      wrap: true,
      sortField: "created_at",
    },
    {
      name: "Warehouse/Package/Dispatch/Order",
      cell(row) {
        return (
          <div>
            {row.warehouse_status?.map((status) => (
              <div key={status.warehouse}>
                {status.warehouse} /{" "}
                {status.packed ? (
                  <FaCheckCircle className="text-green-500 inline" />
                ) : null}{" "}
                {status.pack_qty} /{" "}
                {status.dispatched ? (
                  <FaCheckCircle className="text-green-500 inline" />
                ) : null}{" "}
                {status.dispatch_qty} / {status.qty}
              </div>
            ))}
          </div>
        );
      },
      minWidth: "10%",
    },
  ];

  const contextActionsMemo = useMemo(() => {
    const handleCancelOrders = () => {
      if (selectedRows.length > 0) {
        const orderIds = selectedRows.map((order) => order.order_id);
        const cancelRequestBody: ICancelOrdersRequestBody = {
          order_ids: orderIds,
        };
        dispatch(fetchCancelOrders(cancelRequestBody)).then(() => {
          handleClearRows();
        });
        console.log("Select Orders", selectedRows);
      } else {
        console.log("No orders selected for cancellation");
      }
    };

    const handleCreateBatchIds = () => {
      if (selectedRows.length > 0) {
        const orderIds = selectedRows.map((order) => order.order_id);
        const batchRequestBody: IBatchOrdersRequestBody = {
          order_ids: orderIds,
        };
        dispatch(fetchBatchOrders(batchRequestBody)).then(() => {
          handleClearRows();
        });
        console.log("Select Orders", selectedRows);
      } else {
        console.log("No orders selected for cancellation");
      }
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          {permissions.update && (
            <Button color="failure" size="sm" onClick={handleCancelOrders} pill>
              Cancel Orders
            </Button>
          )}
          {permissions.update && (
            <Button
              color="warning"
              size="sm"
              onClick={handleCreateBatchIds}
              pill
            >
              Batch Orders
            </Button>
          )}
        </div>
      </div>
    );
  }, [dispatch, selectedRows, handleClearRows, permissions.update]);

  const actionsMemo = useMemo(() => {
    const handleExportCSV = () => {
      if (orders.length > 0) {
        const link = document.createElement("a");
        const csvHeaders: ExcelHeader[] = [
          { label: "Order ID", key: "order_id" },
          { label: "Shop Name", key: "shop_name" },
          { label: "ISD", key: "isd" },
          { label: "Mobile", key: "mobile" },
          { label: "City", key: "city" },
          { label: "Items", key: "items" },
          { label: "Subtotal", key: "subtotal" },
          { label: "Discount", key: "discount" },
          { label: "Total", key: "total" },
          { label: "Remark", key: "remark" },
          { label: "Status", key: "status" },
          { label: "Dispatch Status", key: "dispatch_status" },
          { label: "Batch ID", key: "batch_id" },
          { label: "Created At", key: "created_at" },
          { label: "Updated At", key: "updated_at" },
        ];
        let csv = generateExcel(csvHeaders, orders);
        if (csv == null) return;

        const filename = "orders_export.csv";

        if (!csv?.match(/^data:text\/csv/i)) {
          csv = `data:text/csv;charset=utf-8,${csv}`;
        }
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", filename);
        link.click();
      } else {
        console.log("No orders available for export");
      }
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {permissions.read && (
            <Button color="blue" size="sm" pill onClick={handleExportCSV}>
              Export Orders
            </Button>
          )}
          {permissions.create && (
            <Button
              color="blue"
              size="sm"
              pill
              onClick={() => {
                fetchSyncInvoices();
              }}
            >
              Sync Invoices
            </Button>
          )}
          <TextInput
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    );
  }, [orders, search, permissions.create, permissions.read]);

  return (
    <Card>
      <div className="card-body">
        {permissions.read && (
          <DataTable
            title="Orders"
            columns={columns}
            actions={actionsMemo}
            data={orders}
            defaultSortAsc={false}
            defaultSortFieldId={10}
            contextActions={contextActionsMemo}
            noContextMenu={false}
            progressPending={loading || loadingCustomers}
            progressComponent={<Loader />}
            onSort={(column, sortDirection) => {
              setSortField(column.sortField);
              setSortOrder(sortDirection);
            }}
            pagination
            paginationServer
            paginationTotalRows={pagination.totalDocs}
            paginationDefaultPage={currentPage}
            paginationRowsPerPageOptions={[10, 20, 50]}
            onChangePage={setCurrentPage}
            onChangeRowsPerPage={setRowsPerPage}
            selectableRows
            selectableRowDisabled={(row) =>
              Boolean(
                row.batch_id ||
                  row.status === "UNDER_DISPATCH" ||
                  row.status === "PACKED",
              )
            }
            responsive={true}
            selectableRowsHighlight={true}
            striped={true}
            onSelectedRowsChange={({ selectedRows }) =>
              setSelectedRows(selectedRows)
            }
            clearSelectedRows={toggledClearRows}
          />
        )}
      </div>
    </Card>
  );
};

export default OrderTable;
