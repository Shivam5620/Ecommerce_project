import express from "express";
import {
  createRole,
  getRoles,
  updateRole,
} from "../controllers/role.controller";
import {
  createRoleInputSchema,
  updateRoleInputSchema,
} from "../validators/role.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";
import { validate } from "../middlewares/validator.middleware";

const router = express.Router();

router.get(
  endpoints.role.index,
  requireAuth,
  validatePermission(Modules.Role, Features.Role, AllowedPermission.READ),
  getRoles,
);

router.post(
  endpoints.role.index,
  requireAuth,
  validatePermission(Modules.Role, Features.Role, AllowedPermission.CREATE),
  validate(createRoleInputSchema),
  createRole,
);

router.put(
  endpoints.role.id,
  requireAuth,
  validatePermission(Modules.Role, Features.Role, AllowedPermission.UPDATE),
  validate(updateRoleInputSchema),
  updateRole,
);

export default router;
