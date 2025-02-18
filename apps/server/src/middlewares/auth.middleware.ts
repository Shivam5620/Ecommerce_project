import { Request, Response, NextFunction } from "express";
import config from "../config";
import { StatusCodes } from "http-status-codes";
import { UserType } from "@repo/ui/dist/enums/user";
import { APIResponse } from "@repo/ui/dist/types/response";
import { AppError } from "./error.middleware";
import UserModel from "../models/user.model";
import Jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authorization header is required" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token !== config.authentication.api_auth_token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  next();
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt;
    // check json web token exists & is verified
    if (token) {
      Jwt.verify(
        token,
        config.authentication.jwt_secret ?? "",
        async (err: any, decodedToken: any) => {
          if (err) {
            console.error(err.message);
            throw new Error(err.message);
          } else {
            const user = await UserModel.findById(decodedToken.id)
              .populate("role")
              .lean()
              .exec();

            if (user) {
              res.locals.user = user;
              res.locals.isAdmin = user.type === UserType.SUPERADMIN;
              return next();
            } else {
              throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "You are not authorized",
              );
            }
          }
        },
      );
    } else {
      throw new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in");
    }
  } catch (error: any) {
    const response: APIResponse = {
      status: false,
      data: null,
      message: error.message,
    };
    res.status(StatusCodes.UNAUTHORIZED).json(response);
  }
};

// export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
//   if (res.locals.user.type === UserType.SUPERADMIN) {
//     res.locals.isAdmin = true;
//     return next();
//   }
//   const response: APIResponse = {
//     status: false,
//     data: null,
//     message: "You are not logged in as admin user",
//   };
//   res.status(StatusCodes.UNAUTHORIZED).json(response);
// };

// export const checkAdmin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const token = req.cookies.jwt;
//     // check json web token exists & is verified
//     if (token) {
//       const decodedToken: any = Jwt.verify(
//         token,
//         config.authentication.jwt_secret ?? "",
//       );
//       const user = await UserModel.findById(decodedToken.id);
//       if (user) {
//         res.locals.user = user;
//         res.locals.isAdmin = user.type === UserType.SUPERADMIN;
//       }
//     }
//   } catch (error: any) {
//     return next();
//   }
//   next();
// };
