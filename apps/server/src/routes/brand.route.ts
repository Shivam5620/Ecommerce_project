import express from "express";
import { validate } from "../middlewares/validator.middleware";
import {
  addBrand,
  brandUpload,
  deleteBrand,
  getBrands,
  // updateBrand,
} from "../controllers/brand.controller";
import {
  addBrandInputSchema,
  // updateBrandInputSchema,
} from "../validators/brand.validator";
import { fileUploader } from "../middlewares/upload.middleware";
import { deleteInputSchema } from "../validators/common.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  AllowedPermission,
  Features,
  Modules,
} from "@repo/ui/dist/enums/permission";
import { UploadType } from "@repo/ui/dist/enums/upload";
const router = express.Router();

router.get(endpoints.brand.index, getBrands);

router.post(
  endpoints.brand.index,
  requireAuth,
  validatePermission(Modules.Brand, Features.Brand, AllowedPermission.CREATE),
  fileUploader(UploadType.brand, brandUpload, 200, 200),
  validate(addBrandInputSchema),
  addBrand,
);

// router
//   .route("/:id")
//   .put(
//     requireAuth,
//     fileUploader(UploadType.brand, brandUpload),
//     validate(updateBrandInputSchema),
//     updateBrand,
//   );

router
  .route(endpoints.brand.id)

  .delete(
    requireAuth,
    validatePermission(Modules.Brand, Features.Brand, AllowedPermission.DELETE),
    validate(deleteInputSchema),
    deleteBrand,
  );

export default router;
