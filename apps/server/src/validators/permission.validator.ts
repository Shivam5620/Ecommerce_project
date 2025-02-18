import Joi from "joi";
import { IPermission } from "@repo/ui/dist/types/permission";
import { AllowedPermission } from "@repo/ui/dist/enums/permission";

export const createPermissionSchema = Joi.object<IPermission>({
  module: Joi.string().required(),
  feature: Joi.string().required(),
  create: Joi.boolean().required(),
  read: Joi.boolean().required(),
  update: Joi.boolean().required(),
  delete: Joi.boolean().required(),
  import: Joi.boolean().required(),
  export: Joi.boolean().required(),
});

export const createPermissionInputSchema = (() => {
  return {
    body: createPermissionSchema,
  };
})();
