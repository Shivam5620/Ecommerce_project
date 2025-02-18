import express from "express";
import {
  getAllItemGroups,
  importItemGroups,
} from "../controllers/itemGroup.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { validatePermission } from "../middlewares/permission.middleware";

const router = express.Router();

router.get(
  endpoints.itemGroup.index,
  requireAuth,
  validatePermission(
    Modules.Product,
    Features.ItemGroup,
    AllowedPermission.READ,
  ),
  getAllItemGroups,
);

router.post(
  endpoints.itemGroup.import,
  requireAuth,
  validatePermission(
    Modules.Product,
    Features.ItemGroup,
    AllowedPermission.IMPORT,
  ),
  importItemGroups,
);

export default router;
