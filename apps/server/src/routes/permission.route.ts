import express from "express";
import { validate } from "../middlewares/validator.middleware";
import { createPermissionInputSchema } from "../validators/permission.validator";
import {
  createPermission,
  getAllPermissions,
} from "../controllers/permission.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { validatePermission } from "../middlewares/permission.middleware";

const router = express.Router();

router.post(
  endpoints.permission.index,
  requireAuth,
  validatePermission(Modules.Role, Features.Role, AllowedPermission.CREATE),
  validate(createPermissionInputSchema),
  createPermission,
);

router.get(
  endpoints.permission.index,
  requireAuth,
  validatePermission(Modules.Role, Features.Role, AllowedPermission.READ),
  getAllPermissions,
);

export default router;
