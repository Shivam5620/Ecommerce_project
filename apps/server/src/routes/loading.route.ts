import express from "express";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";
import { validate } from "../middlewares/validator.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import {
  createLoadingInputSchema,
  updateLoadingInputSchema,
} from "../validators/loading.validator";
import {
  addLoading,
  updateLoading,
  getAllLoadings,
} from "../controllers/loading.controller";

const router = express.Router();

router.get(
  endpoints.loading.index,
  requireAuth,
  validatePermission(Modules.Loading, Features.Loading, AllowedPermission.READ),
  getAllLoadings,
);

router.post(
  endpoints.loading.index,
  requireAuth,
  validatePermission(
    Modules.Loading,
    Features.Loading,
    AllowedPermission.CREATE,
  ),
  validate(createLoadingInputSchema),
  addLoading,
);

router.put(
  endpoints.loading.id,
  requireAuth,
  validatePermission(
    Modules.Loading,
    Features.Loading,
    AllowedPermission.UPDATE,
  ),
  validate(updateLoadingInputSchema),
  updateLoading,
);

export default router;
