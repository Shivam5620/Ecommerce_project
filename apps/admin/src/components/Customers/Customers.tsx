import { useEffect, useMemo, useState } from "react";
import { Button, Card, TextInput } from "flowbite-react";
import DataTable, { TableColumn } from "react-data-table-component";
import Loader from "../common/Loader/Loader";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ICustomer } from "@repo/ui/types/customer";
import {
  fetchAllCustomers,
  fetchImportCustomers,
} from "../../app/feature/customerSlice";
import { hasPermission } from "@repo/ui/lib/permission";
import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/enums/permission";
import { dashboardRoutes } from "@repo/ui/lib/constants";
import { RiDiscountPercentFill } from "react-icons/ri";
import { BsFillTrainFreightFrontFill } from "react-icons/bs";

const Customers = () => {
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state) => state.customers);
  const [search, setSearch] = useState<string>("");
  const [filteredCustomers, setFilteredCustomers] =
    useState<ICustomer[]>(customers);

  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  useEffect(() => {
    dispatch(fetchAllCustomers());
  }, []);

  const readPermission = hasPermission(
    Modules.Order,
    Features.Order,
    AllowedPermission.READ,
    permissions,
  );

  const columns: TableColumn<ICustomer>[] = [
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
      wrap: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Alias",
      selector: (row) => row.alias,
      sortable: true,
      wrap: true,
    },
    {
      name: "Mobile No",
      selector: (row) => row.mobile_no,
      cell: (row) =>
        row.mobile_no.split(",").map((mobile) => <div>{mobile}</div>),
      sortable: true,
      wrap: true,
    },
    {
      name: "WhatsApp No",
      selector: (row) => row.whatsapp_no,
      sortable: true,
      wrap: true,
    },
    {
      name: "GST No",
      selector: (row) => row.gst_no,
      sortable: true,
      wrap: true,
    },
    {
      name: "GST Type",
      selector: (row) => row.gst_type,
      sortable: true,
      wrap: true,
    },
    {
      name: "Print Name",
      selector: (row) => row.print_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Account Group",
      selector: (row) => row.account_group,
      sortable: true,
      wrap: true,
    },
    {
      name: "Account Category",
      selector: (row) => row.account_category,
      sortable: true,
      wrap: true,
    },
    {
      name: "Master Notes",
      selector: (row) => row.master_notes,
      sortable: true,
      wrap: true,
    },
    {
      name: "HSN Code",
      selector: (row) => row.hsn_code,
      sortable: true,
      wrap: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={dashboardRoutes.customer.discounts.replace(":code", row.code)}
          >
            <RiDiscountPercentFill className="h-5 w-5" />
          </Link>
          <Link
            to={dashboardRoutes.customer.billSundries.replace(
              ":code",
              row.code,
            )}
          >
            <BsFillTrainFreightFrontFill className="h-5 w-5" />
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const searchData = search
      ? customers.filter((customer) => {
          const lowercasedSearch = search.toLowerCase();
          return (
            (customer.code &&
              customer.code.toLowerCase().includes(lowercasedSearch)) ||
            (customer.name &&
              customer.name.toLowerCase().includes(lowercasedSearch))
          );
        })
      : customers;
    setFilteredCustomers(searchData);
  }, [search, customers]);

  const actionsMemo = useMemo(() => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {readPermission && (
            <Button
              size="sm"
              pill
              onClick={() => {
                dispatch(fetchImportCustomers())
                  .unwrap()
                  .then((res) => {
                    if (res.status) {
                      dispatch(fetchAllCustomers());
                    }
                  });
              }}
            >
              Import Customers
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
  }, [customers, search, readPermission]);

  return (
    <Card>
      <div className="card-body">
        {readPermission && (
          <DataTable
            title="Customers"
            columns={columns}
            actions={actionsMemo}
            data={filteredCustomers}
            progressPending={loading}
            progressComponent={<Loader />}
            pagination={true}
            responsive={true}
            striped={true}
          />
        )}
      </div>
    </Card>
  );
};

export default Customers;
