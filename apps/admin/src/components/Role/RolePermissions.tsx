import { useEffect, useState } from "react";
import { Checkbox, Table } from "flowbite-react";
import { Features, Modules } from "@repo/ui/enums/permission";
import { IPermission } from "@repo/ui/types/permission";
import { useAppSelector } from "../../app/hooks";

interface IProps {
  rolePermissions: IPermission[];
  isPreview?: boolean;
  searchTerm?: string;
  onPermissionChange: (
    module: Modules,
    feature: Features,
    updatedPermission: Partial<IPermission>,
  ) => void;
  onSelectAll: (action: keyof IPermission, isChecked: boolean) => void;
}

const RolePermissions: React.FC<IProps> = ({
  rolePermissions,
  isPreview,
  searchTerm = "",
  onPermissionChange,
  onSelectAll,
}) => {
  const { permissions } = useAppSelector((state) => state.roles);
  const [selectAllChecked, setSelectAllChecked] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
    import: false,
    export: false,
  });

  useEffect(() => {
    const allChecked = {
      create: rolePermissions.every((perm) => perm.create),
      read: rolePermissions.every((perm) => perm.read),
      update: rolePermissions.every((perm) => perm.update),
      delete: rolePermissions.every((perm) => perm.delete),
      import: rolePermissions.every((perm) => perm.import),
      export: rolePermissions.every((perm) => perm.export),
    };
    setSelectAllChecked(allChecked);
  }, [rolePermissions]);

  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Module</Table.HeadCell>
        <Table.HeadCell>Feature</Table.HeadCell>
        <Table.HeadCell>
          <p>Create</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.create}
              onChange={(e) => onSelectAll("create", e.target.checked)}
            />
          )}
        </Table.HeadCell>
        <Table.HeadCell>
          <p>Read</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.read}
              onChange={(e) => onSelectAll("read", e.target.checked)}
            />
          )}
        </Table.HeadCell>
        <Table.HeadCell>
          <p>Update</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.update}
              onChange={(e) => onSelectAll("update", e.target.checked)}
            />
          )}
        </Table.HeadCell>
        <Table.HeadCell>
          <p>Delete</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.delete}
              onChange={(e) => onSelectAll("delete", e.target.checked)}
            />
          )}
        </Table.HeadCell>
        <Table.HeadCell>
          <p>Import</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.import}
              onChange={(e) => onSelectAll("import", e.target.checked)}
            />
          )}
        </Table.HeadCell>
        <Table.HeadCell>
          <p>Export</p>
          {!isPreview && (
            <Checkbox
              checked={selectAllChecked.export}
              onChange={(e) => onSelectAll("export", e.target.checked)}
            />
          )}
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {permissions
          .filter(
            (perm) =>
              perm.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
              perm.feature.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((permission) => {
            const rolePermission = rolePermissions.find(
              (rp) =>
                rp.module === permission.module &&
                rp.feature === permission.feature,
            );
            const createPermission = rolePermission?.create ?? false;
            const readPermission = rolePermission?.read ?? false;
            const updatePermission = rolePermission?.update ?? false;
            const deletePermission = rolePermission?.delete ?? false;
            const importPermission = rolePermission?.import ?? false;
            const exportPermission = rolePermission?.export ?? false;

            return (
              <Table.Row
                key={permission._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {permission.module}
                </Table.Cell>
                <Table.Cell>{permission.feature}</Table.Cell>
                <Table.Cell>
                  {permission.create && (
                    <Checkbox
                      checked={createPermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { create: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {permission.read && (
                    <Checkbox
                      checked={readPermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { read: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {permission.update && (
                    <Checkbox
                      checked={updatePermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { update: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {permission.delete && (
                    <Checkbox
                      checked={deletePermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { delete: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {permission.import && (
                    <Checkbox
                      checked={importPermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { import: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {permission.export && (
                    <Checkbox
                      checked={exportPermission}
                      disabled={isPreview}
                      onChange={(e) =>
                        onPermissionChange(
                          permission.module as Modules,
                          permission.feature as Features,
                          { export: e.target.checked },
                        )
                      }
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
      </Table.Body>
    </Table>
  );
};

export default RolePermissions;
