import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Card } from "flowbite-react";
import { getAssetUrl } from "../../lib/asset";
import BiltyModal from "./BiltyModal";
import { UploadType } from "@repo/ui/enums/upload";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAllBiltys } from "../../app/feature/biltySlice";
import Loader from "../common/Loader/Loader";
import { IBilty } from "@repo/ui/types/bilty";

const Bilty: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const dispatch = useAppDispatch();
  const { biltys, loading } = useAppSelector((state) => state.bilty);

  useEffect(() => {
    dispatch(fetchAllBiltys());
  }, [dispatch]);

  const columns: TableColumn<IBilty>[] = [
    {
      name: "#",
      selector: (_, rowIndex) =>
        String(rowIndex !== undefined ? rowIndex + 1 : "-"),
    },
    {
      name: "Dispatch ID",
      selector: (row) => row.dispatch?.dispatch_id ?? "-",
      wrap: true,
    },
    {
      name: "Shop Name",
      selector: (row) => row.order?.shop_name ?? "-",
      wrap: true,
    },
    // {
    //   name: "Vehicle Number",
    //   selector: (row) => row.transport?.vehicle_number ?? "-",
    //   wrap: true,
    // },
    // {
    //   name: "Driver Name",
    //   selector: (row) => row.transport?.driver_name ?? "-",
    //   wrap: true,
    // },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={getAssetUrl(UploadType.bilty, row.image)}
          alt={row.image}
          onError={(e) => (e.currentTarget.src = "/NotFound.png")}
          style={{ width: 100, height: "auto" }}
        />
      ),
    },
  ];

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button size="sm" pill onClick={() => setShowUploadModal(true)}>
            Create Bilty
          </Button>
        </div>
      </div>
    ),
    [],
  );

  return (
    <Card>
      <div className="card-body">
        <div className="whitespace-nowrap custom-data-table">
          <DataTable
            title="Bilty List"
            columns={columns}
            actions={actionsMemo}
            data={biltys}
            progressPending={loading}
            progressComponent={<Loader />}
            pagination
          />
        </div>
      </div>
      {/* Bilty Modal */}
      <BiltyModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </Card>
  );
};

export default Bilty;
