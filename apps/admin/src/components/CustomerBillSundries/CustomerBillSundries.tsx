import { Button, Card } from "flowbite-react";
import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchAllBillSundries,
  fetchImportBillSundries,
} from "../../app/feature/billSundrySlice";
import { ICustomerBillSundry } from "@repo/ui/types/customerBillSundry";
import DataTable, { TableColumn } from "react-data-table-component";
import { fetchCustomerBillSundries } from "../../app/feature/customerBillSundrySlice";
import CustomerBillSundryModal from "./CustomerBillSundryModal";

const CustomerBillSundries = () => {
  const { code } = useParams();
  const dispatch = useAppDispatch();
  const billSundries = useAppSelector(
    (state) => state.customerBillSundries.billSundries,
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (code && code.length) {
      dispatch(fetchCustomerBillSundries({ customer_code: code }));
    }
  }, [code]);

  const columns: TableColumn<ICustomerBillSundry>[] = [
    {
      name: "Bill Sundry Name",
      selector: (row) => row.bill_sundry?.name || "-",
      wrap: true,
    },
    { name: "Type", selector: (row) => row.type },
    { name: "Value", selector: (row) => `${row.value}` },
  ];

  const handleAddBillSundryClick = () => {
    // setSelectedDiscount(null);
    setShowModal(true);
  };

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          <Button
            pill
            size="sm"
            onClick={() => {
              dispatch(fetchImportBillSundries()).then(() => {
                dispatch(fetchAllBillSundries());
              });
            }}
          >
            Import Bill Sundries
          </Button>
          <Button size="sm" pill onClick={() => handleAddBillSundryClick()}>
            Add Bill Sundry
          </Button>
        </div>
      </div>
    ),
    [setShowModal],
  );

  return (
    <>
      <Card>
        <div className="card-body">
          <div className="whitespace-nowrap custom-data-table">
            <DataTable
              title="Customer Bill Sundries"
              columns={columns}
              actions={actionsMemo}
              data={billSundries}
              // progressPending={loading}
              // progressComponent={<Loader />}
              pagination={true}
            />
          </div>
        </div>
      </Card>
      <CustomerBillSundryModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default CustomerBillSundries;
