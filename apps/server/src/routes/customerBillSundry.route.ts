import express from "express";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import {
  addCustomerBillSundry,
  getAllCustomerBillSundries,
} from "../controllers/customerBillSundry.controller";
import { addCustomerBillSundryInputSchema } from "../validators/customerBillSundry.validator";

const router = express.Router();

router.get(
  endpoints.customer.billSundry.index,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.BillSundry,
    AllowedPermission.READ,
  ),
  getAllCustomerBillSundries,
);

router.post(
  endpoints.customer.billSundry.index,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.BillSundry,
    AllowedPermission.CREATE,
  ),
  validate(addCustomerBillSundryInputSchema),
  addCustomerBillSundry,
);

export default router;
