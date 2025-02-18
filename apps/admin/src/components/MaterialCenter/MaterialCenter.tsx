import DataTable, { TableColumn } from "react-data-table-component";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, ToggleSwitch } from "flowbite-react";
import { AiFillEdit } from "react-icons/ai";
import MaterialModal from "./MaterialModel";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMaterialCenters,
  fetchUpdateMaterialCenter,
} from "../../app/feature/materialCenterSlice";
import { IMaterialCenter } from "@repo/ui/types/materialCenter";
import {
  Modules,
  Features,
  AllowedPermission,
} from "@repo/ui/enums/permission";
import { hasPermission } from "@repo/ui/lib/permission";

const MaterialCenter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { materialCenters } = useAppSelector((state) => state.materialCenter);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterialCenter, setSelectedMaterialCenter] =
    useState<IMaterialCenter | null>(null);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const createPermission = hasPermission(
    Modules.MaterialCenter,
    Features.MaterialCenter,
    AllowedPermission.CREATE,
    permissions,
  );

  const updatePermission = hasPermission(
    Modules.MaterialCenter,
    Features.MaterialCenter,
    AllowedPermission.UPDATE,
    permissions,
  );

  useEffect(() => {
    dispatch(fetchMaterialCenters());
  }, []);

  const handleEditClick = (materialCenter: IMaterialCenter) => {
    setSelectedMaterialCenter(materialCenter);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setSelectedMaterialCenter(null);
    setShowModal(true);
  };

  const handleToggleStatus = (materialCenter: IMaterialCenter) => {
    const updatedStatus = materialCenter.status ? false : true;
    dispatch(
      fetchUpdateMaterialCenter({
        id: String(materialCenter._id),
        data: { status: updatedStatus },
      }),
    );
  };

  const handleSaveMaterial = (newMaterial: IMaterialCenter) => {
    if (selectedMaterialCenter) {
      dispatch(
        fetchUpdateMaterialCenter({
          id: String(newMaterial._id),
          data: newMaterial,
        }),
      );
    }
    setShowModal(false);
  };

  const columns: TableColumn<IMaterialCenter>[] = [
    { name: "Name", selector: (row) => row.name },
    { name: "Address Line 1", selector: (row) => row.addressLine1 },
    { name: "Address Line 2", selector: (row) => row.addressLine2 ?? "" },
    { name: "City", selector: (row) => row.city },
    { name: "State", selector: (row) => row.state },
    { name: "PinCode", selector: (row) => row.pinCode },
    {
      name: "Status",
      cell: (row) => (
        <ToggleSwitch
          checked={row.status}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) =>
        updatePermission && (
          <Button size="sm" pill onClick={() => handleEditClick(row)}>
            <AiFillEdit className="h-5 w-5" />
          </Button>
        ),
    },
  ];

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        {createPermission && (
          <Button size="sm" pill onClick={handleAddClick}>
            Add Material
          </Button>
        )}
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
              title="Material Centers"
              columns={columns}
              actions={actionsMemo}
              data={materialCenters}
              pagination
            />
          </div>
        </div>
      </Card>
      {createPermission ||
        (updatePermission && (
          <MaterialModal
            show={showModal}
            materialCenter={selectedMaterialCenter}
            onSave={handleSaveMaterial}
            onClose={() => setShowModal(false)}
          />
        ))}
    </>
  );
};

export default MaterialCenter;
