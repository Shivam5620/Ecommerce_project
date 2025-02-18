import express from "express";
import {
  getDispatchesForWPWithPagination,
  getOrderDispatchById,
  getOrderDispatches,
  getOrdersToDispatch,
  syncInvoices,
  updateDispatch,
} from "../controllers/orderDispatch.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { validate } from "../middlewares/validator.middleware";
import { getPaginatedOrderDispatchLogsInputSchema } from "../validators/orderDispatch.validator";
import {
  getOrderDispatchInputSchema,
  getOrdersInputSchema,
} from "../validators/order.validator";

const router = express.Router();

router.get(
  endpoints.dispatch.orders,
  requireAuth,
  validatePermission(Modules.Order, Features.Dispatch, AllowedPermission.READ),
  validate(getOrdersInputSchema),
  getOrdersToDispatch,
);

router.get(
  endpoints.dispatch.index,
  requireAuth,
  validatePermission(Modules.Order, Features.Dispatch, AllowedPermission.READ),
  validate(getOrderDispatchInputSchema),
  getOrderDispatches,
);

router.get(
  endpoints.dispatch.wpOrderLogs,
  requireAuth,
  validatePermission(Modules.Order, Features.Dispatch, AllowedPermission.READ),
  validate(getPaginatedOrderDispatchLogsInputSchema),
  getDispatchesForWPWithPagination,
);

router.get(
  endpoints.dispatch.id,
  requireAuth,
  validatePermission(Modules.Order, Features.Dispatch, AllowedPermission.READ),
  getOrderDispatchById,
);

router.put(
  endpoints.dispatch.id,
  requireAuth,
  validatePermission(
    Modules.Order,
    Features.Dispatch,
    AllowedPermission.UPDATE,
  ),
  updateDispatch,
);

router.post(
  endpoints.dispatch.syncInvoices,
  requireAuth,
  validatePermission(
    Modules.Order,
    Features.Dispatch,
    AllowedPermission.CREATE,
  ),
  syncInvoices,
);

export default router;
