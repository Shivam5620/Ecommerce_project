import express from "express";
import { getDispatchesToShip } from "../controllers/shipment.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";

const router = express.Router();

router.get(
  endpoints.shipment.dispatchesToShip,
  requireAuth,
  validatePermission(
    Modules.Shipment,
    Features.Shipment,
    AllowedPermission.READ,
  ),
  getDispatchesToShip,
);

export default router;
