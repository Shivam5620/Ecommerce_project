export interface IProductAvailableFilter {
  categories: string[];
  brands: string[];
}

export interface IGetAllProductsQuery {
  available?: boolean;
  codes?: string[];
}

export interface IProductSelectedFilter extends IProductAvailableFilter {
  search: string[];
}

export interface IProduct {
  _id?: string;
  name: string;
  code: string;
  product_code: string;
  brand: string;
  item_group_code: string;
  item_group: string;
  category: Array<string>;
  MOQ: number; // Denotes Minimum Order Quantity
  MRP: number; // Denotes Maximum Retail Price
  PRCTN: number; // Denotes No fo pairs in carton
  color: string;
  size: string;
  sale_price: number;
  discount: number;
  quantity: number;
  image: string;
  rack_no: string;
  points: number;
  hsn_code: string;
  ean_code: string;
  status: number;
  hasImage: boolean;
}

export interface IProductSize {
  quantity: number;
  size: string;
}

export interface IGroupedProduct extends Omit<IProduct, "size"> {
  sizes: IProductSize[];
}

export interface ISetProductImageRequestBody {
  code: string;
  color: string;
}

export interface IBusyProductImportResponse {
  ItemCode: string;
  Code: string;
  Name: string;
  ItemGroup: string;
  ItemGroupCode: string;
  Category: string;
  Brand: string;
  MOQ: string;
  RackNo: string;
  Size: string;
  Color: string;
  SalePrice: string;
  Discount: string;
  ClosingStock: string;
  TotalAmount: string;
  MRP: string;
  PRCTN: string;
  Points: string;
  EanCode: string;
  HSNCode: string;
}
