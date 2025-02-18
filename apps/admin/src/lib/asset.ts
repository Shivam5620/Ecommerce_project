import { UploadType } from "@repo/ui/enums/upload";

export const getAssetUrl = (type: UploadType, key: string) => {
  return `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${type}/${key}`;
};
