import { useEffect, useState, useMemo } from "react";
import { Card, Button } from "flowbite-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllCustomerBeats } from "../../app/feature/customerBeatSlice";
import { ICustomerBeat } from "@repo/ui/types/customerBeat";
import CustomerBeatModal from "./CustomerBeatModal";
import { AiFillEdit } from "react-icons/ai";

const CustomerBeat = () => {
  const dispatch = useAppDispatch();
  const { customerBeats } = useAppSelector((state) => state.customerBeats);
  const { customers } = useAppSelector((state) => state.customers);

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomerBeat, setSelectedCustomerBeat] =
    useState<ICustomerBeat | null>(null);

  useEffect(() => {
    dispatch(fetchAllCustomerBeats());
  }, [dispatch]);

  const customerCodeToName = customers.reduce(
    (acc: Record<string, string>, customer) => {
      acc[customer.code] = customer.name;
      return acc;
    },
    {},
  );

  const customerBeatColumns: TableColumn<ICustomerBeat>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_codes.join(", "),

      cell: (row) => {
        return (
          <div>
            {row.customer_codes.map((c) => (
              <p>{customerCodeToName[c]}</p>
            ))}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <AiFillEdit
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setSelectedCustomerBeat(row);
              setShowModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <Button
          size="sm"
          pill
          onClick={() => {
            setSelectedCustomerBeat(null);
            setShowModal(true);
          }}
        >
          Add Beat
        </Button>
      </div>
    ),
    [],
  );

  return (
    <>
      <Card>
        <div className="card-body">
          <div className="whitespace-nowrap custom-data-table">
            <DataTable
              title="Customer Beats"
              columns={customerBeatColumns}
              actions={actionsMemo}
              data={customerBeats}
              pagination
            />
          </div>
        </div>
      </Card>
      <CustomerBeatModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        selectedCustomerBeat={selectedCustomerBeat}
      />
    </>
  );
};

export default CustomerBeat;
