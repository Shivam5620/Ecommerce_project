import express from "express";
import {
  getAllBillSundries,
  importBillSundries,
} from "../controllers/billSundry.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { endpoints } from "@repo/ui/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { validatePermission } from "../middlewares/permission.middleware";

const router = express.Router();

router.get(
  endpoints.billSundry.index,
  requireAuth,
  validatePermission(
    Modules.Product,
    Features.ItemGroup,
    AllowedPermission.READ,
  ),
  getAllBillSundries,
);

router.post(
  endpoints.billSundry.import,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.BillSundry,
    AllowedPermission.IMPORT,
  ),
  importBillSundries,
);

export default router;
