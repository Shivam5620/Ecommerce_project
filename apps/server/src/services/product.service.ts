import ProductModel from "../models/product.model";
import {
  IBusyProductImportResponse,
  IProduct,
} from "@repo/ui/dist/types/product";
import { FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { AppError } from "../middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import * as busyService from "../services/busy.service";
import logger from "../utils/logger";

export const getProductById = async (id: string) => {
  const productExist = await ProductModel.findById(id);

  if (!productExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  return productExist;
};

export const getAllProducts = async () => {
  return ProductModel.find();
};

export const find = async (
  filter: FilterQuery<IProduct> = {},
  projection?: ProjectionType<IProduct> | null | undefined,
  options?: QueryOptions<IProduct> | null | undefined,
) => {
  return ProductModel.find(filter, projection, options);
};

/**
 * Fetch all unique brands from the products collection
 * @returns {Promise<string[]>} An array of unique brand names
 */
export const fetchBrands = async (): Promise<string[]> => {
  return ProductModel.distinct("brand").sort({ brand: 1 }).exec();
};

/**
 * Set product codes for products which don't have one.
 * Product code is a unique number for each code and color combination.
 * If a product has a product code, it will be skipped.
 * The product code will start from the greatest product code in the collection + 1.
 * @returns {Promise<WriteOpResult[]>} Result of the bulk write operation
 */
// export const setProductCodes = async () => {
//   const products = await ProductModel.find().sort({ product_code: -1 }).lean();

//   const bulkOps = [];

//   let code = products.length ? products[0].product_code : 1;

//   let codeMapper: {
//     [code: string]: {
//       [color: string]: number;
//     };
//   } = {}; // {[code]: {[color]: [product_code]}}

//   products.forEach((product) => {
//     const { code, color, product_code } = product;

//     if (!codeMapper[code]) {
//       codeMapper[code] = {};
//     }

//     if (!codeMapper[code][color]) {
//       codeMapper[code][color] = product_code;
//     }
//   });

//   for (const product of products) {
//     // No need to update product code if it already has one
//     if (product.product_code) continue;

//     let product_code;
//     if (codeMapper[product.code] && codeMapper[product.code][product.color]) {
//       product_code = codeMapper[product.code][product.color];
//     } else {
//       code++;
//       if (!codeMapper[product.code]) {
//         codeMapper[product.code] = {};
//       }
//       codeMapper[product.code][product.color] = code;
//       product_code = code;
//     }

//     bulkOps.push({
//       updateMany: {
//         filter: { code: product.code, color: product.color },
//         update: {
//           $set: {
//             product_code,
//           },
//         },
//       },
//     });
//   }
//   return ProductModel.bulkWrite(bulkOps);
// };

export const fetchWarehouses = async () => {
  return ProductModel.distinct("rack_no").sort({ rack_no: 1 }).exec();
};

export const processAndSaveImage = async (
  code: string,
  color: string,
  file: Express.Multer.File,
): Promise<IProduct[]> => {
  // Get product
  await ProductModel.updateMany(
    {
      code: { $regex: new RegExp(`^${code}$`, "i") },
      color: { $regex: new RegExp(`^${color}$`, "i") },
    },
    {
      $set: {
        image: file.filename,
      },
    },
    { new: true },
  );

  return ProductModel.find({ color, code });
};

export const importProducts = async () => {
  const products =
    await busyService.fetchData<IBusyProductImportResponse>("products");

  if (products.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "No products found to import");
  }

  logger.info(`Importing ${products.length} products`);

  await ProductModel.updateMany({}, { $set: { quantity: 0 } });

  const bulkOps = products.map((product) => {
    return {
      updateOne: {
        filter: {
          code: { $regex: new RegExp(`^${product.Code}$`, "i") },
          color: { $regex: new RegExp(`^${product.Color}$`, "i") },
          size: { $regex: new RegExp(`^${product.Size}$`, "i") },
        },
        update: {
          $set: {
            name: product.Name,
            code: product.Code,
            brand: product.Brand,
            item_group: product.ItemGroup,
            item_group_code: product.ItemGroupCode,
            category: product.Category.split(";"),
            color: product.Color,
            size: product.Size,
            quantity: Number(product.ClosingStock),
            // image: product.Code + "_" + product.Color.replace(/[\s\/]/g, "") + ".jpg";
            rack_no: product.RackNo,
            product_code: Number(product.ItemCode),
            sale_price: product.Brand.includes("Campus")
              ? Number(product.MRP)
              : Number(product.SalePrice),
            discount: Number(product.Discount),
            ean_code: product.EanCode,
            hsn_code: product.HSNCode,
            MOQ: Number(product.MOQ),
            MRP: Number(product.MRP),
            PRCTN: Number(product.PRCTN),
            points: Number(product.Points),
          },
        },
        upsert: true,
      },
    };
  });

  const result = await ProductModel.bulkWrite(bulkOps);

  logger.info(`Imported ${result.modifiedCount} products`);
  return result;
};
