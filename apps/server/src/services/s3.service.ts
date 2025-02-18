import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import config from "../config";
import { UploadType } from "@repo/ui/dist/enums/upload";
import { extname } from "path";
import { randomUUID } from "crypto";

const client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.access_key,
    secretAccessKey: config.aws.secret_access_key,
  },
});

/**
 * Upload a file to an S3 bucket.
 * @param {{ bucketName: string, key: string, filePath: string }}
 */
export const putObjectToS3 = async (
  type: UploadType,
  file: Express.Multer.File,
) => {
  const ext = extname(file.originalname);
  const fileName = `${randomUUID()}${ext}`;
  const Key = `${type}/${fileName}`;
  console.log("Uploading file to S3", file);

  const command = new PutObjectCommand({
    Bucket: config.aws.s3.bucket,
    ACL: "public-read",
    ContentType: file.mimetype,
    Key,
    Body: file.buffer,
  });

  try {
    await client.send(command);
    return fileName;
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${config.aws.s3.bucket}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${config.aws.s3.bucket}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

export const deleteObjectFromS3 = async (fileKey: string) => {
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.aws.s3.bucket,
        Key: fileKey,
      }),
    );
    await waitUntilObjectNotExists(
      { client, maxWaitTime: 10000 },
      { Bucket: config.aws.s3.bucket, Key: fileKey },
    );
    // A successful delete, or a delete for a non-existent object, both return
    // a 204 response code.
    console.log(
      `The object "${fileKey}" from bucket "${config.aws.s3.bucket}" was deleted, or it didn't exist.`,
    );
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "NoSuchBucket"
    ) {
      console.error(
        `Error from S3 while deleting object from ${config.aws.s3.bucket}. The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while deleting object from ${config.aws.s3.bucket}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};
