import express from "express";

import { validate } from "../middlewares/validator.middleware";
import {
  createTransport,
  getOrdersToTransport,
  transportUpload,
} from "../controllers/transport.controller";
import { fileUploader } from "../middlewares/upload.middleware";
import { createTransportInputSchema } from "../validators/transport.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { UploadType } from "@repo/ui/dist/enums/upload";

const router = express.Router();

router.get(
  endpoints.transport.ordersToTransport,
  requireAuth,
  validatePermission(
    Modules.Transport,
    Features.Transport,
    AllowedPermission.READ,
  ),
  getOrdersToTransport,
);

router.post(
  endpoints.transport.index,
  requireAuth,
  validatePermission(
    Modules.Transport,
    Features.Transport,
    AllowedPermission.CREATE,
  ),
  fileUploader(UploadType.transport, transportUpload),
  validate(createTransportInputSchema),
  createTransport,
);

export default router;
