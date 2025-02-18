import express from "express";
import {
  addOrder,
  batchOrders,
  cancelOrders,
  dispatchOrder,
  dispatchUpload,
  getAllOrders,
  getOrderById,
  getPaginatedOrders,
  updateOrder,
} from "../controllers/order.controller";
import { validate } from "../middlewares/validator.middleware";
import {
  addOrderInputSchema,
  cancelOrdersInputSchema,
  batchOrdersInputSchema,
  dispatchOrdersInputSchema,
  updateOrderInputSchema,
  getOrdersInputSchema,
  getPaginatedOrdersInputSchema,
} from "../validators/order.validator";
import { requireAuth } from "../middlewares/auth.middleware";
import { getByIdInputSchema } from "../validators/common.validator";
import { fileUploader } from "../middlewares/upload.middleware";
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
  endpoints.order.index,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.READ),
  validate(getOrdersInputSchema),
  getAllOrders,
);

router.get(
  endpoints.order.paginated,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.READ),
  validate(getPaginatedOrdersInputSchema),
  getPaginatedOrders,
);

router.post(endpoints.order.index, validate(addOrderInputSchema), addOrder);

router.post(
  endpoints.order.cancel,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.UPDATE),
  validate(cancelOrdersInputSchema),
  cancelOrders,
);

router.post(
  endpoints.order.batch,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.UPDATE),
  validate(batchOrdersInputSchema),
  batchOrders,
);

router.post(
  endpoints.order.dispatch,
  requireAuth,
  validatePermission(
    Modules.Order,
    Features.Dispatch,
    AllowedPermission.CREATE,
  ),
  fileUploader(UploadType.dispatch, dispatchUpload),
  validate(dispatchOrdersInputSchema),
  dispatchOrder,
);

router.put(
  endpoints.order.id,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.UPDATE),
  validate(updateOrderInputSchema),
  updateOrder,
);

// router.post("/set-order-status", requireAuth, setOrderStatuses);

router.get(
  endpoints.order.id,
  requireAuth,
  validatePermission(Modules.Order, Features.Order, AllowedPermission.READ),
  validate(getByIdInputSchema),
  getOrderById,
);

export default router;
