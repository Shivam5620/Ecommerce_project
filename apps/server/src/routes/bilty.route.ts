import express from "express";
import { validate } from "../middlewares/validator.middleware";
import { fileUploader } from "../middlewares/upload.middleware";
import {
  addBiltySchema,
  getDispatchesByTransportDateInputSchema,
} from "../validators/bilty.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { UploadType } from "@repo/ui/dist/enums/upload";
import {
  addBilty,
  biltyUpload,
  getBiltys,
  getDispatchesByTransportAndDate,
} from "../controllers/bilty.controller";
import { validatePermission } from "../middlewares/permission.middleware";
import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";

const router = express.Router();

router.get(
  endpoints.bilty.index,
  requireAuth,
  validatePermission(Modules.Bilty, Features.Bilty, AllowedPermission.READ),
  getBiltys,
);

router.get(
  endpoints.bilty.dispatches,
  requireAuth,
  validatePermission(Modules.Bilty, Features.Bilty, AllowedPermission.READ),
  validate(getDispatchesByTransportDateInputSchema),
  getDispatchesByTransportAndDate,
);

router.post(
  endpoints.bilty.index,
  requireAuth,
  validatePermission(Modules.Bilty, Features.Bilty, AllowedPermission.CREATE),
  fileUploader(UploadType.bilty, biltyUpload, 500),
  validate(addBiltySchema),
  addBilty,
);

export default router;
