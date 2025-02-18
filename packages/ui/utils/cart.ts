import { IGroupedProduct, IProduct } from "../types/product";

/**
 * Calculate the total quantity and amount of a given array of products in cart.
 * @param {Array<Pick<IGroupedProduct, "sizes" | "sale_price" | "discount">>} items - The array of products in cart.
 * @return {{totalQty: number, totalAmount: number}} - The total quantity and amount of given products.
 */
export const calculateCartTotals = (
  items: Array<Pick<IGroupedProduct, "sizes" | "sale_price" | "discount">>,
) => {
  let totalQty = 0;
  let totalAmount = 0;
  for (const item of items) {
    // Loop through sizes
    const discountedPrice = getDiscountedPrice(item.sale_price, item.discount);

    for (const size of item.sizes) {
      totalQty += size.quantity;
      totalAmount += size.quantity * discountedPrice;
    }
  }
  return { totalQty, totalAmount };
};

/**
 * Calculate discounted price of a given product based on given discounts.
 * @param {number} sale_price - The sale price of the product.
 * @param {number} discount_1 - Discount 1 in percentage.
 * @param {number} [discount_2=0] - Discount 2 as fixed.
 * @param {number} [discount_3=0] - Discount 3 in percentage.
 * @return {number} - The discounted price of the product.
 */
export const getDiscountedPrice = (
  sale_price: IProduct["sale_price"],
  discount_1: number,
  discount_2: number = 0,
  discount_3: number = 0,
) => {
  // Calculate Discount 1
  let price = sale_price;
  if (discount_1 > 0) {
    let reducePercentage = 100 - discount_1;
    reducePercentage = reducePercentage / 100;
    price = price * reducePercentage;
  }

  // Calculate Discount 2
  if (discount_2 > 0) {
    price = price - discount_2;
  }

  // Calculate Discount 3
  if (discount_3 > 0) {
    let reducePercentage = 100 - discount_3;
    reducePercentage = reducePercentage / 100;
    price = price * reducePercentage;
  }

  return parseFloat(price.toFixed(2));
};
