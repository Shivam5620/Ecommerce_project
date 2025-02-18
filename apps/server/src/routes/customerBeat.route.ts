import express from "express";
import * as customerBeatsController from "../controllers/customerBeat.controller";
import {
  addCustomerBeatInputSchema,
  updateCustomerBeatInputSchema,
  getCustomerBeatByIdInputSchema,
} from "../validators/customerBeat.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import {
  Modules,
  Features,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";

const router = express.Router();

router.post(
  endpoints.customerBeats.index,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeat,
    AllowedPermission.CREATE,
  ),
  validate(addCustomerBeatInputSchema),
  customerBeatsController.createCustomerBeat,
);

router.get(
  endpoints.customerBeats.index,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeat,
    AllowedPermission.READ,
  ),
  customerBeatsController.getAllCustomerBeats,
);

router.get(
  endpoints.customerBeats.id,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeat,
    AllowedPermission.READ,
  ),
  validate(getCustomerBeatByIdInputSchema),
  customerBeatsController.getCustomerBeatById,
);

router.put(
  endpoints.customerBeats.id,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeat,
    AllowedPermission.UPDATE,
  ),
  validate(updateCustomerBeatInputSchema),
  customerBeatsController.updateCustomerBeat,
);

export default router;
