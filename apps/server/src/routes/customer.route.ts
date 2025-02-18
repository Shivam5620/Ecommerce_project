import express from "express";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getAllCustomers,
  importCustomers,
} from "../controllers/customer.controller";
const router = express.Router();

router.get(
  endpoints.customer.index,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.Customer,
    AllowedPermission.READ,
  ),
  getAllCustomers,
);

router.post(
  endpoints.customer.import,
  requireAuth,
  validatePermission(
    Modules.Customer,
    Features.Customer,
    AllowedPermission.IMPORT,
  ),
  importCustomers,
);

export default router;
