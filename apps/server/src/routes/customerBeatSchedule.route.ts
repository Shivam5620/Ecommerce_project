import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validator.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import {
  Modules,
  Features,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  createCustomerBeatSchedule,
  deleteCustomerBeatSchedule,
  getAllCustomerBeatSchedule,
  updateCustomerBeatSchedule,
} from "../controllers/customerBeatSchedule.controller";
import {
  addCustomerBeatScheduleInputSchema,
  updateCustomerBeatScheduleInputSchema,
} from "../validators/customerBeatSchedule.validator";
import { deleteInputSchema } from "../validators/common.validator";

const router = express.Router();

router.post(
  endpoints.customerBeatSchedule.index,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeatSchedule,
    AllowedPermission.CREATE,
  ),
  validate(addCustomerBeatScheduleInputSchema),
  createCustomerBeatSchedule,
);

router.get(
  endpoints.customerBeatSchedule.index,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeatSchedule,
    AllowedPermission.READ,
  ),
  getAllCustomerBeatSchedule,
);

router.put(
  endpoints.customerBeatSchedule.id,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeatSchedule,
    AllowedPermission.UPDATE,
  ),
  validate(updateCustomerBeatScheduleInputSchema),
  updateCustomerBeatSchedule,
);

router.delete(
  endpoints.customerBeatSchedule.id,
  requireAuth,
  validatePermission(
    Modules.CustomerBeat,
    Features.CustomerBeatSchedule,
    AllowedPermission.DELETE,
  ),
  validate(deleteInputSchema),
  deleteCustomerBeatSchedule,
);

export default router;
