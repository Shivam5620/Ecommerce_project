import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBrand } from "@repo/ui/types/brand";
import * as service from "../services/brand";

export interface BrandState {
  loading: boolean;
  brands: IBrand[];
}

const initialState: BrandState = {
  loading: false,
  brands: [],
};

export const fetchAddBrand = createAsyncThunk(
  "brand/add",
  async (data: FormData) => {
    const response = await service.addBrand(data);
    return response.data;
  },
);

export const fetchAllBrands = createAsyncThunk("brand/all", async () => {
  const response = await service.getBrands();
  return response.data;
});

export const fetchDeleteBrand = createAsyncThunk(
  "brand/delete",
  async (id: string) => {
    const response = await service.deleteBrand(id);
    return response.data;
  },
);

export const brandSlice = createSlice({
  name: "brands",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = [...state.brands, action.payload.data];
      })
      .addCase(fetchAddBrand.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchAllBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.brands = action.payload.data;
        }
      })
      .addCase(fetchAllBrands.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchDeleteBrand.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload.data) return;

        if (action.payload.status) {
          state.brands = state.brands.filter(
            (brand) => brand.name !== action.payload.data.name,
          );
        }
      })
      .addCase(fetchDeleteBrand.rejected, (state) => {
        state.loading = false;
      });
  },
});

// export const {} = brandSlice.actions;

export default brandSlice.reducer;
