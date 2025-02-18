import express from "express";
import { validate } from "../middlewares/validator.middleware";
import {
  changePasswordInputSchema,
  loginUserInputSchema,
} from "../validators/auth.validator";
import { changePassword, login, logout } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validatePermission } from "../middlewares/permission.middleware";
import { endpoints } from "@repo/ui/dist/lib/constants";

const router = express.Router();

router.post(endpoints.auth.login, validate(loginUserInputSchema), login);

router.post(
  endpoints.auth.changePassword,
  requireAuth,
  validate(changePasswordInputSchema),
  changePassword,
);

router.post(endpoints.auth.logout, requireAuth, logout);

export default router;
