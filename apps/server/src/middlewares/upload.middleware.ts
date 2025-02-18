import { APIResponse } from "@repo/ui/dist/types/response";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { UploadType } from "@repo/ui/dist/enums/upload";
import { putObjectToS3 } from "../services/s3.service";
import sharp from "sharp";

export const fileUploader =
  (type: UploadType, upload: RequestHandler, width?: number, height?: number) =>
  (req: Request, res: Response, next: NextFunction) =>
    upload(req, res, async function (err: any) {
      if (err) {
        console.error("Upload err:", err);
        const response: APIResponse = {
          status: false,
          data: null,
          message: err.message,
        };
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      // Upload file to S3 based on the upload type passed
      if (req.file) {
        if (width) {
          // Resize the image
          const resizedImageBuffer = await await sharp(req.file.buffer)
            .resize({
              width,
              height,
              fit: sharp.fit.inside,
            }) // Resize the image to a width of 800px, keeping aspect ratio
            .toBuffer();

          // Update the file buffer with the resized image
          req.file.buffer = resizedImageBuffer;
        }

        const s3Response = await putObjectToS3(type, req.file);
        if (s3Response) {
          req.file.filename = s3Response;
        }
      }

      // Everything went fine.
      next();
    });
