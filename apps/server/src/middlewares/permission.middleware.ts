import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/dist/enums/permission";
import { hasPermission } from "@repo/ui/dist/lib/permission";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const validatePermission =
  (module: Modules, feature: Features, access: AllowedPermission) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        data: null,
        message: "User not found in request",
      });
    }

    const rolePermissions = res.locals.user?.role?.permissions ?? [];

    const validPermission = hasPermission(
      module,
      feature,
      access,
      rolePermissions,
    );

    if (!validPermission) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: false,
        data: null,
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
