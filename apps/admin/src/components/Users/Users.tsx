import { useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import moment from "moment";
import { Button, Card, ToggleSwitch } from "flowbite-react";
import { IUser } from "@repo/ui/types/user";
import { hasPermission } from "@repo/ui/lib/permission";
import config from "../../config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchUpdateUser, fetchUsers } from "../../app/feature/userSlice";
import UserModal from "./UserModal";
import { fetchWarehouses } from "../../app/feature/productSlice";
import { AiFillEdit } from "react-icons/ai";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/enums/permission";
import { fetchAllRole } from "../../app/feature/roleSlice";
import useConfirm from "../common/ConfirmModal/ConfirmDialog";

const Users = () => {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const { users, loading } = useAppSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const permissions = useAppSelector(
    (state) => state.auth.user?.role?.permissions ?? [],
  );

  const createPermission = hasPermission(
    Modules.User,
    Features.User,
    AllowedPermission.CREATE,
    permissions,
  );

  const updatePermission = hasPermission(
    Modules.User,
    Features.User,
    AllowedPermission.UPDATE,
    permissions,
  );

  const columns: TableColumn<IUser>[] = [
    { name: "Name", selector: (row) => row.name, wrap: true },
    { name: "Email", selector: (row) => row.email, wrap: true },
    { name: "Type", selector: (row) => row.type, wrap: true },
    { name: "Mobile", selector: (row) => row.mobile, wrap: true },
    // { name: "Image", selector: (row) => row.image },
    {
      name: "Warehouses",
      selector: (row) => (row.warehouses ? row.warehouses.join(", ") : "N/A"),
      wrap: true,
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
    columns.push(
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => (
          <ToggleSwitch
            checked={row.status === true}
            onChange={() => {
              confirm({
                description: "Are you sure to change the status?",
              }).then((choice) => {
                if (choice) {
                  handleToggleStatus(row);
                }
              });
            }}
          />
        ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <AiFillEdit
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleEditClick(row)}
          />
        ),
      },
    );
  }

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Function to handle the toggle of user status
  const handleToggleStatus = (user: IUser) => {
    const updatedStatus = user.status === true ? false : true;
    dispatch(
      fetchUpdateUser({
        id: String(user._id),
        data: { status: updatedStatus },
      }),
    );
  };

  const handleAddUserClick = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllRole());
    dispatch(fetchWarehouses({}));
  }, []);

  const actionsMemo = useMemo(
    () => (
      <div className="flex justify-between items-center">
        <div className="flex gap-2  ">
          {createPermission && (
            <Button size="sm" pill onClick={() => handleAddUserClick()}>
              Add User
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
              title="Users"
              columns={columns}
              actions={actionsMemo}
              data={users}
              progressPending={loading}
              pagination={true}
            />
          </div>
        </div>
      </Card>
      <UserModal
        show={showModal}
        user={selectedUser}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Users;
