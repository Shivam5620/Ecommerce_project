import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IGetAllProductsQuery, IProduct } from "@repo/ui/dist/types/product";
import { asyncHandler } from "../middlewares/error.middleware";
import * as service from "../services/product.service";
import multer from "multer";
import { FilterQuery } from "mongoose";

export const productImageUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const getAllProducts = asyncHandler(
  async (
    req: Request<
      Record<never, never>,
      APIResponse<Array<IProduct>>,
      Record<never, never>,
      IGetAllProductsQuery,
      Record<string, any>
    >,
    res: Response<APIResponse<Array<IProduct>>, Record<string, any>>,
  ) => {
    const conditions: FilterQuery<IProduct> = {};
    if (req.query.available === true) {
      conditions.quantity = { $gt: 0 };
    } else if (req.query.available === false) {
      conditions.quantity = { $lte: 0 };
    }

    if (req.query.codes?.length) {
      conditions.code = { $in: req.query.codes };
    }

    const result = await service.find(
      conditions,
      {},
      {
        sort: {
          code: 1,
          color: 1,
          size: 1,
        },
      },
    );

    const response: APIResponse<Array<IProduct>> = {
      status: true,
      data: result,
      message: "Products fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await service.getProductById(id);

    if (!result) {
      const response: APIResponse = {
        status: true,
        data: null,
        message: "Product not found",
      };

      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    const response: APIResponse<IProduct> = {
      status: true,
      data: result,
      message: "Product fetched successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

// export const setProductCodes = asyncHandler(
//   async (req: Request, res: Response) => {
//     const result = await service.setProductCodes();
//     const response: APIResponse = {
//       status: true,
//       data: result,
//       message: "Product codes set successfully",
//     };
//     res.status(StatusCodes.OK).json(response);
//   },
// );

export const importProducts = asyncHandler(
  async (
    req: Request<Record<never, never>, any, any, Record<never, never>>,
    res: Response,
  ) => {
    const result = await service.importProducts();

    const response: APIResponse = {
      status: true,
      data: result,
      message: "Products imported successfully",
    };

    res.status(StatusCodes.OK).json(response);
  },
);

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await service.fetchBrands();
  const response: APIResponse = {
    status: true,
    data: brands,
    message: "Product brands fetched successfully",
  };
  res.status(StatusCodes.OK).json(response);
});

export const getWarehouses = asyncHandler(
  async (req: Request, res: Response) => {
    const warehouses = await service.fetchWarehouses();
    const response: APIResponse = {
      status: true,
      data: warehouses,
      message: "Product warehouses fetched successfully",
    };
    res.status(StatusCodes.OK).json(response);
  },
);

export const setProductImage = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;
    const { color, code } = req.body;

    if (!file) {
      const response: APIResponse = {
        status: false,
        data: null,
        message: "No image data provided",
      };
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    const products = await service.processAndSaveImage(code, color, file);

    const response: APIResponse<IProduct[]> = {
      status: true,
      data: products,
      message: "Image saved successfully",
    };

    return res.status(StatusCodes.OK).json(response);
  },
);
