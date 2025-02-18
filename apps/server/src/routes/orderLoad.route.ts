import express from "express";
import { validate } from "../middlewares/validator.middleware";
import {
  createOrderLoad,
  getDispatchesToLoad,
  orderLoadUpload,
} from "../controllers/orderLoad.controller";
import { fileUploader } from "../middlewares/upload.middleware";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { UploadType } from "@repo/ui/dist/enums/upload";
import { createOrderLoadInputSchema } from "../validators/orderLoad.validator";

const router = express.Router();

router.get(
  endpoints.orderLoad.dispatchesToLoad,
  requireAuth,
  validatePermission(Modules.Order, Features.OrderLoad, AllowedPermission.READ),
  getDispatchesToLoad,
);

router.post(
  endpoints.orderLoad.index,
  requireAuth,
  validatePermission(
    Modules.Order,
    Features.OrderLoad,
    AllowedPermission.CREATE,
  ),
  fileUploader(UploadType.orderLoad, orderLoadUpload, 500),
  validate(createOrderLoadInputSchema),
  createOrderLoad,
);

export default router;
