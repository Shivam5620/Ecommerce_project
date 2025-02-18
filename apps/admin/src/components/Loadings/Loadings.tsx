import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { hasPermission } from "@repo/ui/lib/permission";
import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/enums/permission";
import { ILoading } from "@repo/ui/types/loading";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card } from "flowbite-react";
import moment from "moment";
import config from "../../config";
import { fetchLoadings } from "../../app/feature/loadingSlice";
import LoadingModal from "./LoadingModal";
import Loader from "../common/Loader/Loader";
import { AiFillEdit } from "react-icons/ai";

const Loadings = () => {
  const dispatch = useAppDispatch();
  const { loadings, loading } = useAppSelector((state) => state.loadings);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoading, setSelectedLoading] = useState<ILoading | null>(null);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  useEffect(() => {
    dispatch(fetchLoadings());
  }, []);

  const createPermission = hasPermission(
    Modules.Loading,
    Features.Loading,
    AllowedPermission.CREATE,
    permissions,
  );

  const updatePermission = hasPermission(
    Modules.User,
    Features.User,
    AllowedPermission.UPDATE,
    permissions,
  );

  const columns: TableColumn<ILoading>[] = [
    {
      name: "Loading ID",
      selector: (row) => row.loading_id,
      wrap: true,
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (row) => row.driver_name,
      wrap: true,
      sortable: true,
    },
    {
      name: "Vehicle Number",
      selector: (row) => row.vehicle_number,
      wrap: true,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      wrap: true,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.created_at).format(config.date.format),
      wrap: true,
    },
    {
      name: "Last Updated At",
      selector: (row) => moment(row.updated_at).format(config.date.format),
      wrap: true,
    },
  ];

  if (updatePermission) {
    columns.push({
      name: "Actions",
      cell: (row) => (
        <Button size="sm" pill onClick={() => handleEditClick(row)}>
          <AiFillEdit className="h-5 w-5" />
        </Button>
      ),
    });
  }

  const handleEditClick = (loading: ILoading) => {
    setSelectedLoading(loading);
    setShowModal(true);
  };

  const handleAddLoadingClick = () => {
    setSelectedLoading(null);
    setShowModal(true);
  };

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          {createPermission && (
            <Button size="sm" pill onClick={() => handleAddLoadingClick()}>
              Add Loading
            </Button>
          )}
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
              title="Loadings"
              columns={columns}
              actions={actionsMemo}
              data={loadings}
              progressPending={loading}
              progressComponent={<Loader />}
              pagination={true}
            />
          </div>
        </div>
      </Card>
      <LoadingModal
        show={showModal}
        selectedLoading={selectedLoading}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Loadings;
