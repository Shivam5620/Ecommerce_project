import express from "express";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  addCustomerDiscount,
  deleteCustomerDiscount,
  getAllCustomerDiscounts,
} from "../controllers/customerDiscount.controller";
import { validate } from "../middlewares/validator.middleware";
import { addCustomerDiscountInputSchema } from "../validators/customerDiscount.validator";
import { deleteInputSchema } from "../validators/common.validator";

const router = express.Router();

router.get(
  endpoints.customer.discount.index,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.Discount,
    AllowedPermission.READ,
  ),
  getAllCustomerDiscounts,
);

router.post(
  endpoints.customer.discount.index,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.Discount,
    AllowedPermission.CREATE,
  ),
  validate(addCustomerDiscountInputSchema),
  addCustomerDiscount,
);

router.delete(
  endpoints.customer.discount.id,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.Discount,
    AllowedPermission.DELETE,
  ),
  validate(deleteInputSchema),
  deleteCustomerDiscount,
);

export default router;
