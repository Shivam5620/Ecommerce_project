import React from "react";
import { IRole } from "@repo/ui/types/role";
import RolePermissions from "./RolePermissions";

interface ExpandableRowProps {
  data: IRole;
}
const ExpandableRow: React.FC<ExpandableRowProps> = ({ data }) => {
  if (!data.permissions || data.permissions.length === 0) {
    return <div>No permissions available for this role.</div>;
  }

  return (
    <div className="p-4">
      <RolePermissions
        rolePermissions={data.permissions}
        onPermissionChange={() => {}}
        isPreview={true}
        onSelectAll={() => {}}
      />
    </div>
  );
};

export default ExpandableRow;
