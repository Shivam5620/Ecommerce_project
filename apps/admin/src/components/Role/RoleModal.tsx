import { useEffect, useState } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import RolePermissions from "./RolePermissions";
import { IPermission } from "@repo/ui/types/permission";
import { IRole } from "@repo/ui/types/role";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCreateRole, fetchUpdateRole } from "../../app/feature/roleSlice";
import { Features, Modules } from "@repo/ui/enums/permission";

interface RoleModalProps {
  showModal: boolean;
  onClose: () => void;
  selectedRole: IRole | null;
}

const RoleModal: React.FC<RoleModalProps> = ({
  showModal,
  onClose,
  selectedRole,
}) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { permissions } = useAppSelector((state) => state.roles);

  const [role, setRole] = useState<IRole>({
    name: "",
    description: "",
    permissions: [],
  });

  useEffect(() => {
    if (selectedRole !== null) {
      setRole({
        name: selectedRole.name,
        description: selectedRole.description,
        permissions: selectedRole.permissions.map((p) => ({
          module: p.module,
          feature: p.feature,
          create: p.create ?? false,
          read: p.read ?? false,
          update: p.update ?? false,
          delete: p.delete ?? false,
          import: p.import ?? false,
          export: p.export ?? false,
        })),
      });
    } else {
      setRole({
        name: "",
        description: "",
        permissions: permissions.map((p) => ({
          module: p.module,
          feature: p.feature,
          create: p.create ?? false,
          read: p.read ?? false,
          update: p.update ?? false,
          delete: p.delete ?? false,
          import: p.import ?? false,
          export: p.export ?? false,
        })),
      });
    }
  }, [selectedRole, permissions]);

  const handlePermissionChange = (
    module: Modules,
    feature: Features,
    updatedPermission: Partial<IPermission>,
  ) => {
    const index = role.permissions.findIndex(
      (permission) =>
        permission.module === module && permission.feature === feature,
    );

    // If permission is not found, then push the permission
    if (index < 0) {
      // Find the permission from permissions array
      const permission = permissions.find(
        (perm) => perm.module === module && perm.feature === feature,
      );
      if (permission) {
        setRole({
          ...role,
          permissions: [
            ...role.permissions,
            {
              module,
              feature,
              create: false,
              read: false,
              update: false,
              delete: false,
              import: false,
              export: false,
              ...updatedPermission,
            },
          ],
        });
      }
    } else {
      const rolePermissions = Array.from(role.permissions);
      rolePermissions[index] = {
        module: rolePermissions[index].module,
        feature: rolePermissions[index].feature,
        create: rolePermissions[index].create,
        read: rolePermissions[index].read,
        update: rolePermissions[index].update,
        delete: rolePermissions[index].delete,
        import: rolePermissions[index].import,
        export: rolePermissions[index].export,
        ...updatedPermission,
      };

      setRole({ ...role, permissions: rolePermissions });
    }
  };

  const handleSelectAll = (action: keyof IPermission, isChecked: boolean) => {
    const updatedPermissions = role.permissions.map((permission) => ({
      ...permission,
      [action]: isChecked,
    }));
    setRole({ ...role, permissions: updatedPermissions });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("Submitting form", { role });
    if (selectedRole) {
      const roleId = selectedRole._id;
      if (roleId !== undefined) {
        dispatch(fetchUpdateRole({ id: roleId, data: role }))
          .unwrap()
          .then((res) => {
            if (res.status) {
              onClose();
            }
          });
      }
    } else {
      dispatch(fetchCreateRole(role))
        .unwrap()
        .then((res) => {
          if (res.status) {
            onClose();
          }
        });
    }
  };

  return (
    <Modal show={showModal} onClose={onClose} size="5xl">
      <Modal.Header>
        {selectedRole !== null ? "Edit Role" : "Add New Role"}
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-4">
            <TextInput
              placeholder="Role Name"
              value={role.name}
              onChange={(e) => setRole({ ...role, name: e.target.value })}
            />
            <TextInput
              placeholder="Description"
              value={role.description}
              onChange={(e) =>
                setRole({ ...role, description: e.target.value })
              }
            />
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Set Permissions</h2>
            <TextInput
              placeholder="Search by module..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-64 overflow-y-auto">
              <RolePermissions
                searchTerm={searchTerm}
                onPermissionChange={handlePermissionChange}
                rolePermissions={role.permissions}
                isPreview={false}
                onSelectAll={handleSelectAll}
              />
            </div>
          </div>
          <Button className="mt-4" type="submit">
            {selectedRole ? "Update Role" : "Add Role"}
          </Button>
        </Modal.Body>
      </form>
    </Modal>
  );
};

export default RoleModal;
