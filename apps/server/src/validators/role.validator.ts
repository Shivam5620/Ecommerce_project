import Joi from "joi";
import { IRole } from "@repo/ui/dist/types/role";
import { createPermissionSchema } from "./permission.validator";

export const createRoleInputSchema = (() => {
  return {
    body: Joi.object<IRole>({
      name: Joi.string().required(),
      description: Joi.string().required(),
      permissions: Joi.array().items(createPermissionSchema).required(),
    }),
  };
})();

export const updateRoleInputSchema = (() => {
  const role = Joi.object<Partial<IRole>>({
    name: Joi.string(),
    description: Joi.string(),
    permissions: Joi.array().items(createPermissionSchema),
  }).required();

  return {
    body: role,
    params: Joi.object({
      id: Joi.string().hex().length(24).required(),
    }),
  };
})();
