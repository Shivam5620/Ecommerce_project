import jwt from "jsonwebtoken";
import config from "../config";

export const jwtMaxAge = 3 * 24 * 60 * 60;

export const createToken = (id: string) => {
  return jwt.sign({ id }, config.authentication.jwt_secret ?? "", {
    expiresIn: jwtMaxAge,
  });
};
