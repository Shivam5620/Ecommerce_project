import { IGroupedProduct } from "./product";

export interface ICartItem extends IGroupedProduct {
  comment: string;
}
