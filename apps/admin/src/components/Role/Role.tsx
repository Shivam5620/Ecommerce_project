import { useState, useEffect, useMemo } from "react";
import { Button, Card } from "flowbite-react";
import { AiFillEdit } from "react-icons/ai";
import DataTable, { TableColumn } from "react-data-table-component";
import RoleModal from "./RoleModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IRole } from "@repo/ui/types/role";
import { fetchAllPermission, fetchAllRole } from "../../app/feature/roleSlice";
import ExpandableRow from "./ExpandableRow";
import { hasPermission } from "@repo/ui/lib/permission";
import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/enums/permission";

const Role = () => {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const createPermission = hasPermission(
    Modules.Role,
    Features.Role,
    AllowedPermission.CREATE,
    permissions,
  );

  const updatePermission = hasPermission(
    Modules.Role,
    Features.Role,
    AllowedPermission.UPDATE,
    permissions,
  );

  useEffect(() => {
    dispatch(fetchAllRole());
    dispatch(fetchAllPermission());
  }, []);

  const roleColumns: TableColumn<IRole>[] = [
    { name: "Role Name", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description, sortable: true },
  ];

  if (updatePermission) {
    roleColumns.push({
      name: "Action",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          {updatePermission && (
            <AiFillEdit
              className="h-5 w-5 cursor-pointer"
              onClick={() => {
                setSelectedRole(row);
                setShowModal(true);
              }}
            />
          )}
        </div>
      ),
    });
  }
  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          {createPermission && (
            <Button
              size="sm"
              pill
              onClick={() => {
                setSelectedRole(null);
                setShowModal(true);
              }}
            >
              Add Role
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
              title="Roles"
              columns={roleColumns}
              actions={actionsMemo}
              data={roles}
              pagination
              expandableRows
              expandableRowsComponent={ExpandableRow}
            />
          </div>
        </div>
      </Card>
      {/* Role Modal */}
      <RoleModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        selectedRole={selectedRole}
      />
    </>
  );
};

export default Role;
