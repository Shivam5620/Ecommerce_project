import products from "./products";
import { readdirSync, unlinkSync } from "fs";
import path from "path";

// Get the set of product images
const productImages = new Set();
products.forEach((product) => {
  productImages.add(product.image);
});

console.log({ productImages });

const filterProductImages = async () => {
  // List down the files in productImages directory
  const filesInDirectory = await readdirSync(path.join(__dirname, "product"));

  console.log({ filesInDirectory });

  // Loop through the filesInDirectory and delete the file if not in the set of productImages
  for (const file of filesInDirectory) {
    if (!productImages.has(file)) {
      await unlinkSync(path.join(__dirname, "product", file));
    }
  }
};

filterProductImages();
