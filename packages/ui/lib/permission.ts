import { AllowedPermission, Features, Modules } from "../enums/permission";
import { IPermission } from "../types/permission";

/**
 * Determines if a user has a specific permission for a given module and feature.
 *
 * @param {Modules} module - The module to check the permission against.
 * @param {Features} feature - The feature within the module to check the permission for.
 * @param {AllowedPermission} access - The specific permission to check (e.g., create, read, update, delete, import, export).
 * @param {IPermission[]} rolePermissions - An array of permissions assigned to the user's role.
 * @returns {boolean} - Returns true if the user has the specified permission, false otherwise.
 */
export const hasPermission = (
  module: Modules,
  feature: Features,
  access: AllowedPermission,
  rolePermissions: IPermission[],
) => {
  let hasPermission = false;

  // Get the rolePermission

  const rolePermission = rolePermissions.find(
    (rp) => rp.module === module && rp.feature === feature,
  );

  if (rolePermission) {
    // Check if the rolePermission has the required access
    hasPermission = rolePermission[access] ?? false;
  }

  return hasPermission;
};

/**
 * Given a module, feature, and an array of rolePermissions, returns an object
 * with the create, read, update, delete, import, and export permissions for
 * that module and feature. If the permission is not found, it will default to
 * false.
 *
 * @param {Modules} module The module to get the permissions for.
 * @param {Features} feature The feature to get the permissions for.
 * @param {IPermission[]} rolePermissions An array of rolePermissions.
 * @returns {{create: boolean, read: boolean, update: boolean, delete: boolean, import: boolean, export: boolean}} An object with the permissions.
 */
export const getPermissions = (
  module: Modules,
  feature: Features,
  rolePermissions: IPermission[],
) => {
  const rolePermission = rolePermissions.find(
    (rp) => rp.module === module && rp.feature === feature,
  );

  return {
    create: rolePermission?.create ?? false,
    read: rolePermission?.read ?? false,
    update: rolePermission?.update ?? false,
    delete: rolePermission?.delete ?? false,
    import: rolePermission?.import ?? false,
    export: rolePermission?.export ?? false,
  };
};
