import { IGroupedOrderItem, IOrderItem } from "../types/order";
import { IGroupedProduct, IProduct, IProductSize } from "../types/product";

// Custom sorting function for sizes like "C10", "C8", "C9", "G9", "G10"
const sortSizes = (a: IProductSize, b: IProductSize) => {
  const [letterA, numberA] = a.size.match(/[A-Za-z]+|\d+/g) as [string, string];
  const [letterB, numberB] = b.size.match(/[A-Za-z]+|\d+/g) as [string, string];

  // Compare the letter parts first
  if (letterA < letterB) return -1;
  if (letterA > letterB) return 1;

  // If letters are the same, compare the numeric parts
  return parseInt(numberA) - parseInt(numberB);
};

export const groupProductsBySize = (
  products: IProduct[],
): IGroupedProduct[] => {
  // Group products by code and color
  const groupedProducts = products.reduce(
    (acc: Record<string, IGroupedProduct>, product) => {
      const key = `${product.code.toLowerCase()}_${product.color.toLowerCase()}`;
      const size = {
        quantity: product.quantity,
        size: product.size,
      };
      if (!acc[key]) {
        acc[key] = {
          ...product,
          sizes: [size],
        };
      } else {
        acc[key].sizes.push(size);
      }
      return acc;
    },
    {},
  );

  // Sort the sizes within each grouped product
  const groupedProductsArray: IGroupedProduct[] =
    Object.values(groupedProducts);
  // .map((groupedProduct) => ({
  //   ...groupedProduct,
  // sizes: groupedProduct.sizes.sort(sortSizes),
  // }));

  return groupedProductsArray;
};

export const groupOrderProductsBySize = (
  products: IOrderItem[],
): IGroupedOrderItem[] => {
  // Group products by code and color
  const groupedProducts = products.reduce(
    (acc: Record<string, IGroupedOrderItem>, product: IOrderItem) => {
      const key = `${product.code}_${product.color}`;
      const size = {
        quantity: product.qty,
        size: product.size,
      };
      if (!acc[key]) {
        acc[key] = {
          ...product,
          sizes: [size],
        };
      } else {
        acc[key].sizes.push(size);
      }
      return acc;
    },
    {},
  );

  // Sort the sizes within each grouped product
  const groupedOrderItemsArray: IGroupedOrderItem[] = Object.values(
    groupedProducts,
  ).map((groupedProduct) => ({
    ...groupedProduct,
    sizes: groupedProduct.sizes.sort(sortSizes),
  }));

  return groupedOrderItemsArray;
};

export function groupProductsByCode<T = any>(items: any[]) {
  const groupedProducts: { [key: string]: Array<T> } = {};

  items.forEach((product) => {
    const code = product.code;
    if (groupedProducts[code]) {
      groupedProducts[code].push(product);
    } else {
      groupedProducts[code] = [product];
    }
  });

  return groupedProducts;
}

export const extractProductCategories = (products: IProduct[]) => {
  const categories = [];
  for (const product of products) {
    categories.push(...product.category);
  }

  return [...new Set(categories)];
};

export const extractProductBrands = (products: IProduct[]) => {
  const brands = [];
  for (const product of products) {
    brands.push(product.brand);
  }

  return [...new Set(brands)];
};
