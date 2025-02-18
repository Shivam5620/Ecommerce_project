import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  Slice,
} from "@reduxjs/toolkit";
import {
  IGetAllProductsQuery,
  IGroupedProduct,
  IProduct,
  IProductAvailableFilter,
  IProductSelectedFilter,
} from "@repo/ui/types/product";
import * as service from "../services/product";
import {
  extractProductBrands,
  extractProductCategories,
  groupProductsBySize,
} from "@repo/ui/lib/product";

// Define a type for the slice state
export interface ProductState {
  loading: boolean;
  products: IProduct[];
  filteredProducts: IGroupedProduct[];
  availableFilters: IProductAvailableFilter;
  selectedFilters: IProductSelectedFilter;
}

export const initialFilters: IProductSelectedFilter = {
  search: [],
  brands: [],
  categories: [],
};

// Define the initial state using that type
const initialState: ProductState = {
  loading: false,
  products: [],
  filteredProducts: [],
  availableFilters: {
    brands: [],
    categories: [],
  },
  selectedFilters: initialFilters,
};

export const fetchProducts = createAsyncThunk(
  "product/all",
  async (query: IGetAllProductsQuery) => {
    const response = await service.fetchProducts(query);
    return response.data.data;
  },
);

const filterProducts = (
  products: IProduct[],
  filters: IProductSelectedFilter,
): IGroupedProduct[] => {
  let filteredProducts = products;

  // Filter products based on brand
  if (filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.brands
        .map((brand) => brand.toLowerCase())
        .includes(product.brand.toLowerCase()),
    );
  }

  // Filter products based on category
  if (filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      const lowerCaseFilterCategories = filters.categories.map((category) =>
        category.toLowerCase(),
      );

      // Loop through product categories
      for (const category of product.category) {
        if (lowerCaseFilterCategories.includes(category.toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }

  // Filter products based on search
  if (filters.search.length > 0) {
    // Loop through search and filter products
    for (const search of filters.search) {
      filteredProducts = filteredProducts.filter((product) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          product.name.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.brand.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.code.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.size.toLocaleLowerCase().includes(lowerCaseSearch) ||
          product.category.some((category) =>
            category.toLocaleLowerCase().includes(lowerCaseSearch),
          )
        );
      });
    }
  }

  return groupProductsBySize(filteredProducts);
};

export const productSlice: Slice<ProductState> = createSlice({
  name: "products",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<IProductSelectedFilter>>,
    ): void => {
      state.selectedFilters = Object.assign(
        state.selectedFilters,
        action.payload,
      );
      state.filteredProducts = filterProducts(
        state.products,
        state.selectedFilters,
      );
    },
    setSearchFilters: (state, action: PayloadAction<string[]>): void => {
      state.selectedFilters.search = action.payload;
      state.filteredProducts = filterProducts(
        state.products,
        state.selectedFilters,
      );
    },
    setCategoryFilters: (state, action: PayloadAction<string[]>): void => {
      state.selectedFilters.categories = action.payload;
      state.filteredProducts = filterProducts(
        state.products,
        state.selectedFilters,
      );
    },
    setBrandFilters: (state, action: PayloadAction<string[]>): void => {
      state.selectedFilters.brands = action.payload;
      state.filteredProducts = filterProducts(
        state.products,
        state.selectedFilters,
      );
    },
    clearFilters: (state) => {
      state.selectedFilters = initialFilters;
      state.filteredProducts = filterProducts(
        state.products,
        state.selectedFilters,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.products = [];
        state.loading = true;
        state.filteredProducts = [];
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Array<IProduct>>) => {
          // Extract Categories from products
          const categories = extractProductCategories(action.payload);
          state.availableFilters.categories = categories;

          // Extract Brands from products
          const brands = extractProductBrands(action.payload);
          state.availableFilters.brands = brands;

          // Group products by size
          // const groupedProductsArray = groupProductsBySize(action.payload);

          state.loading = false;
          state.products = action.payload.map((product) => {
            // We're parsing the MOQ to integer as the MOQ is number in database.
            // Once the MOQ is converted to integer, we'll remove it
            product.MOQ = Number(product.MOQ);
            return product;
          });
          state.filteredProducts = filterProducts(
            action.payload,
            state.selectedFilters,
          );
        },
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.products = [];
        state.loading = false;
        state.filteredProducts = [];
      });
  },
});

export const {
  setFilters,
  setSearchFilters,
  setBrandFilters,
  setCategoryFilters,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
