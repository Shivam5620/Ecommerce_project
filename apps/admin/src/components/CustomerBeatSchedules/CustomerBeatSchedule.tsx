import { useEffect, useState, useMemo } from "react";
import { Card, Button } from "flowbite-react";
import DataTable, { TableColumn } from "react-data-table-component";
import { AiFillEdit } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUsers } from "../../app/feature/userSlice";
import { fetchAllCustomerBeats } from "../../app/feature/customerBeatSlice";
import CustomerBeatScheduleModal from "./CustomerBeatScheduleModal";
import { ICustomerBeatSchedule } from "@repo/ui/types/customerBeatSchedule";
import { fetchAllCustomerBeatSchedule } from "../../app/feature/customerBeatScheduleSlice";

const CustomerBeatSchedule = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedBeatSchedule, setSelectedBeatSchedule] =
    useState<ICustomerBeatSchedule | null>(null);
  const { customerBeatSchedules, loading } = useAppSelector(
    (state) => state.customerBeatSchedules,
  );
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllCustomerBeats());
    dispatch(fetchAllCustomerBeatSchedule());
  }, [dispatch]);

  const columns: TableColumn<ICustomerBeatSchedule>[] = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Salesman",
      selector: (row) => row.user?.name ?? "",
      sortable: true,
    },
    {
      name: "Beat",
      selector: (row) => row.customer_beat?.name ?? "",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <AiFillEdit
            className="h-5 w-5 cursor-pointer"
            onClick={() => {
              setSelectedBeatSchedule(row);
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
            setSelectedBeatSchedule(null);
            setShowModal(true);
          }}
        >
          Add Schedule
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
              title="Scheduled Beats"
              columns={columns}
              actions={actionsMemo}
              data={customerBeatSchedules}
              pagination
              responsive
              progressPending={loading}
            />
          </div>
        </div>
      </Card>

      <CustomerBeatScheduleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        selectedBeatSchedule={selectedBeatSchedule}
      />
    </>
  );
};

export default CustomerBeatSchedule;
