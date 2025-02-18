import Joi from "joi";
import { StatusCodes } from "http-status-codes";

import { NextFunction, Request, Response } from "express";
import { pick } from "../utils/object";
import { APIResponse } from "@repo/ui/dist/types/response";

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const validSchema = pick(schema, ["params", "query", "body", "file"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);

    if (error) {
      // on fail return comma separated errors
      const response: APIResponse = {
        status: false,
        data: null,
        message: error.details.map((x) => x.message).join(", "),
      };
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
    Object.assign(req, value);
    return next();
  };
