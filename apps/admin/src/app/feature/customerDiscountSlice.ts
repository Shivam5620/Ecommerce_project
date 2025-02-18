import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/customerDiscount";
import {
  ICreateCustomerDiscountRequestBody,
  ICustomerDiscount,
  IGetAllCustomerDiscountsQuery,
} from "@repo/ui/types/customerDiscount";

export interface CustomerDiscountState {
  loading: boolean;
  discounts: ICustomerDiscount[];
}

const initialState: CustomerDiscountState = {
  loading: false,
  discounts: [],
};

export const fetchCustomerDiscounts = createAsyncThunk(
  "customerDiscount/all",
  async (query: IGetAllCustomerDiscountsQuery) => {
    const response = await service.fetchCustomerDiscounts(query);
    return response.data;
  },
);

export const fetchAddCustomerDiscount = createAsyncThunk(
  "customerDiscount/add",
  async (data: ICreateCustomerDiscountRequestBody) => {
    const response = await service.fetchAddCustomerDiscount(data);
    return response.data;
  },
);

export const fetchDeleteCustomerDiscount = createAsyncThunk(
  "customerDiscount/delete",
  async (id: string) => {
    const response = await service.fetchDeleteCustomerDiscount(id);
    return response.data;
  },
);

export const customerDiscountSlice = createSlice({
  name: "customerDiscounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All Customer Discounts
      .addCase(fetchCustomerDiscounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerDiscounts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.discounts = action.payload.data;
        }
      })
      .addCase(fetchCustomerDiscounts.rejected, (state) => {
        state.loading = false;
      })

      // Add Customer Discount
      .addCase(fetchAddCustomerDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddCustomerDiscount.fulfilled, (state, payload) => {
        state.loading = false;
        if (payload.payload.status) {
          state.discounts.push(payload.payload.data);
        }
      })
      .addCase(fetchAddCustomerDiscount.rejected, (state) => {
        state.loading = false;
      })

      // Delete Customer Discount
      .addCase(fetchDeleteCustomerDiscount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeleteCustomerDiscount.fulfilled, (state, payload) => {
        state.loading = false;
        if (payload.payload.status) {
          state.discounts = state.discounts.filter(
            (discount) => discount._id !== payload.payload.data._id,
          );
        }
      })
      .addCase(fetchDeleteCustomerDiscount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerDiscountSlice.reducer;
