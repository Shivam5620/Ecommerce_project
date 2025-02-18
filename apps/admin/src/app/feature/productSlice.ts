import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IGetAllProductsQuery, IProduct } from "@repo/ui/types/product";
import * as service from "../services/product";

// Define a type for the slice state
export interface ProductState {
  loading: boolean;
  brands: string[];
  products: IProduct[];
  warehouses: string[];
}

// Define the initial state using that type
const initialState: ProductState = {
  loading: false,
  products: [],
  brands: [],
  warehouses: [],
};

export const fetchProducts = createAsyncThunk(
  "product/all",
  async (query: IGetAllProductsQuery) => {
    const response = await service.fetchProducts(query);
    return response.data.data;
  },
);

export const fetchWarehouses = createAsyncThunk(
  "product/warehouses",
  async (query: any) => {
    const response = await service.fetchWarehouses(query);
    return response.data.data;
  },
);

export const fetchProductBrands = createAsyncThunk(
  "product/brands",
  async (query: any) => {
    const response = await service.fetchProductBrands(query);
    return response.data.data;
  },
);

export const fetchSetImage = createAsyncThunk<
  IProduct[],
  { file: File; code: string; color: string }
>("product/uploadImage", async ({ file, code, color }) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("code", code);
  formData.append("color", color);

  const response = await service.uploadProductImage(formData);
  return response.data.data;
});

export const fetchImportProducts = createAsyncThunk(
  "product/import",
  async () => {
    const response = await service.fetchImportProducts();
    return response.data;
  },
);

export const productSlice = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.products = [];
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.products = [];
        state.loading = false;
      })

      // Warehouses
      .addCase(fetchWarehouses.pending, (state) => {
        state.warehouses = [];
        state.loading = true;
      })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.warehouses = action.payload;
        state.loading = false;
      })
      .addCase(fetchWarehouses.rejected, (state) => {
        state.warehouses = [];
        state.loading = false;
      })

      // Image Upload
      .addCase(fetchSetImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSetImage.fulfilled, (state, action) => {
        const products = [...state.products];

        for (const newProduct of action.payload) {
          const index = products.findIndex(
            (product) => product._id === newProduct._id,
          );

          if (index > -1) {
            products[index] = newProduct;
          }
        }

        state.products = products;
        state.loading = false;
      })
      .addCase(fetchSetImage.rejected, (state) => {
        state.loading = false;
      })

      // Brands
      .addCase(fetchProductBrands.pending, (state) => {
        state.brands = [];
        state.loading = true;
      })
      .addCase(fetchProductBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchProductBrands.rejected, (state) => {
        state.brands = [];
        state.loading = false;
      })

      // Import
      .addCase(fetchImportProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportProducts.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchImportProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {} = productSlice.actions;

export default productSlice.reducer;
