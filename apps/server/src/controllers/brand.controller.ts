import { Request, Response } from "express";
import multer from "multer";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "@repo/ui/dist/types/response";
import { IBrand } from "@repo/ui/dist/types/brand";
import BrandModel from "../models/brand.model";
import { asyncHandler } from "../middlewares/error.middleware";
import { deleteObjectFromS3 } from "../services/s3.service";

export const brandUpload = multer({
  storage: multer.memoryStorage(),
}).single("image");

export const addBrand = asyncHandler(
  async (req: Request<any, any, IBrand>, res: Response) => {
    // Check if a brand with the same name already exists
    const existingBrand = await BrandModel.findOne({
      name: req.body.name,
    }).exec();

    if (existingBrand) {
      const response: APIResponse = {
        status: false,
        data: null,
        message: "Brand with the same name already exists",
      };
      return res.status(StatusCodes.CONFLICT).json(response);
    }

    req.body.image = req.file?.filename ?? "";

    const brand = new BrandModel(req.body);
    const result = await brand.save();
    const response: APIResponse = {
      status: true,
      data: result,
      message: "Brand Added Successfully",
    };

    res.status(StatusCodes.CREATED).json(response);
  },
);

// export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
//   const file: any = req.file ?? {};
//   const { id } = req.params;
//   if (config.environment === ENVS.development) {
//     if (file.buffer?.length) {
//       req.body.logo = createDataUrl(
//         file.mimetype ?? "",
//         file?.buffer ?? Buffer.from(""),
//       );
//     }
//   } else if (file.filename) {
//     req.body.logo = file.filename;
//   }

//   const result = await BrandModel.findByIdAndUpdate(id ?? "", req.body, {
//     new: true,
//   }).exec();
//   const response: APIResponse = {
//     status: true,
//     data: result,
//     message: "Brand Updated Successfully",
//   };

//   res.status(StatusCodes.CREATED).json(response);
// });

export const getBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await BrandModel.find().lean().exec();

  const response: APIResponse = {
    status: true,
    data: brands,
    message: "Brands fetched successfully",
  };

  res.status(StatusCodes.OK).json(response);
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const result = await BrandModel.findByIdAndDelete(id).exec();
  console.log(result);
  if (!result) {
    const response: APIResponse = {
      status: false,
      data: null,
      message: "Brand not found",
    };
    return res.status(404).json(response);
  }

  // Delete the image from S3
  await deleteObjectFromS3(result.image);

  const response: APIResponse = {
    status: true,
    data: result,
    message: "Brand successfully deleted",
  };
  res.json(response);
});
