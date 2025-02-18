import express from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validator.middleware";
import {
  addUserInputSchema,
  updateUserInputSchema,
} from "../validators/user.validator";
import { deleteInputSchema } from "../validators/common.validator";
import {
  Features,
  Modules,
  AllowedPermission,
} from "@repo/ui/dist/enums/permission";
import { endpoints } from "@repo/ui/dist/lib/constants";
import { validatePermission } from "../middlewares/permission.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  endpoints.user.index,
  requireAuth,
  validatePermission(Modules.User, Features.User, AllowedPermission.CREATE),
  validate(addUserInputSchema),
  addUser,
);

router.get(
  endpoints.user.index,
  requireAuth,
  validatePermission(Modules.User, Features.User, AllowedPermission.READ),
  getAllUsers,
);

router.put(
  endpoints.user.id,
  requireAuth,
  validatePermission(Modules.User, Features.User, AllowedPermission.UPDATE),
  validate(updateUserInputSchema),
  updateUser,
);

router.delete(
  endpoints.user.id,
  requireAuth,
  validatePermission(Modules.User, Features.User, AllowedPermission.DELETE),
  validate(deleteInputSchema),
  deleteUser,
);

export default router;
