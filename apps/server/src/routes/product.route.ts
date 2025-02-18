import express from "express";
import {
  getProductById,
  getAllProducts,
  importProducts,
  getBrands,
  getWarehouses,
  setProductImage,
  productImageUpload,
} from "../controllers/product.controller";
import { validate } from "../middlewares/validator.middleware";
import { getByIdInputSchema } from "../validators/common.validator";
import {
  getAllProductsInputSchema,
  setProductImageInputSchema,
} from "../validators/product.validator";
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

const router = express.Router();

router.get(
  endpoints.product.index,
  validate(getAllProductsInputSchema),
  getAllProducts,
);

router.get(endpoints.product.warehouse, getWarehouses);

router.get(
  endpoints.product.brands,
  requireAuth,
  validatePermission(Modules.Product, Features.Product, AllowedPermission.READ),
  getBrands,
);

router.get(endpoints.product.id, validate(getByIdInputSchema), getProductById);

router.post(
  endpoints.product.setProductImage,
  requireAuth,
  validatePermission(
    Modules.Product,
    Features.Product,
    AllowedPermission.UPDATE,
  ),
  fileUploader(UploadType.product, productImageUpload, 500, 300),
  validate(setProductImageInputSchema),
  setProductImage,
);

// router.post(
//   "/set-product-codes",
//   requireAuth,
//   validatePermission(
//     Modules.Product,
//     Features.Product,
//     AllowedPermission.UPDATE,
//   ),
//   setProductCodes,
// );

router.post(
  endpoints.product.import,
  requireAuth,
  validatePermission(
    Modules.Product,
    Features.Product,
    AllowedPermission.IMPORT,
  ),
  importProducts,
);

export default router;
