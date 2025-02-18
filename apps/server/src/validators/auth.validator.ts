import { IChangePasswordBody, ILoginBody } from "@repo/ui/dist/types/auth";
import Joi from "joi";

export const loginUserInputSchema = (() => {
  const schema = Joi.object<ILoginBody>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return {
    body: schema,
  };
})();

export const changePasswordInputSchema = (() => {
  const schema = Joi.object<IChangePasswordBody>({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  });

  return {
    body: schema,
  };
})();
