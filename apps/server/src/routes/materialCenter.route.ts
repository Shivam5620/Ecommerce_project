import express from "express";
import {
  addMaterialCenter,
  getAllMaterialCenter,
  updateMaterialCenter,
} from "../controllers/materialCenter.controller";
import { validate } from "../middlewares/validator.middleware";
import {
  addMaterialCenterInputSchema,
  updateMaterialCenterInputSchema,
} from "../validators/materialCenter.validator";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { requireAuth } from "../middlewares/auth.middleware";
const router = express.Router();

router.post(
  endpoints.materialCenter.index,
  requireAuth,
  validatePermission(
    Modules.MaterialCenter,
    Features.MaterialCenter,
    AllowedPermission.CREATE,
  ),
  validate(addMaterialCenterInputSchema),
  addMaterialCenter,
);
router.get(
  endpoints.materialCenter.index,
  requireAuth,
  validatePermission(
    Modules.MaterialCenter,
    Features.MaterialCenter,
    AllowedPermission.READ,
  ),
  getAllMaterialCenter,
);
router.put(
  endpoints.materialCenter.id,
  requireAuth,
  validatePermission(
    Modules.MaterialCenter,
    Features.MaterialCenter,
    AllowedPermission.UPDATE,
  ),
  validate(updateMaterialCenterInputSchema),
  updateMaterialCenter,
);

export default router;
