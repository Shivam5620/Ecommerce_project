import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as service from "../services/brand";
import { IBrand } from "@repo/ui/types/brand";

// Define a type for the slice state
export interface BrandState {
  loading: boolean;
  brands: IBrand[];
}

// Define the initial state using that type
const initialState: BrandState = {
  loading: false,
  brands: [],
};

export const fetchBrands = createAsyncThunk("brand/all", async (query: any) => {
  const response = await service.fetchBrands(query);
  return response.data.data;
});

export const brandSlice = createSlice({
  name: "brands",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brands = [];
        state.loading = true;
      })
      .addCase(
        fetchBrands.fulfilled,
        (state, action: PayloadAction<Array<IBrand>>) => {
          state.loading = false;
          state.brands = action.payload;
        },
      )
      .addCase(fetchBrands.rejected, (state) => {
        state.brands = [];
        state.loading = false;
      });
  },
});

// export const {} = brandSlice.actions;

export default brandSlice.reducer;
