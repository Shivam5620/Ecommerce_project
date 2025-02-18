import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/customerBillSundry";
import {
  ICustomerBillSundry,
  IGetAllCustomerBillSundriesQuery,
} from "@repo/ui/types/customerBillSundry";

export interface CustomerBillSundryState {
  loading: boolean;
  billSundries: ICustomerBillSundry[];
}

const initialState: CustomerBillSundryState = {
  loading: false,
  billSundries: [],
};

export const fetchCustomerBillSundries = createAsyncThunk(
  "customerBillSundry/all",
  async (query: IGetAllCustomerBillSundriesQuery) => {
    const response = await service.fetchCustomerBillSundries(query);
    return response.data;
  },
);

export const fetchAddCustomerBillSundry = createAsyncThunk(
  "customerBillSundry/add",
  async (data: ICustomerBillSundry) => {
    const response = await service.fetchAddCustomerBillSundry(data);
    return response.data;
  },
);

export const customerBillSundrySlice = createSlice({
  name: "customerBillSundry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All Customer Discounts
      .addCase(fetchCustomerBillSundries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerBillSundries.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.billSundries = action.payload.data;
        }
      })
      .addCase(fetchCustomerBillSundries.rejected, (state) => {
        state.loading = false;
      })

      // Add Customer Discount
      .addCase(fetchAddCustomerBillSundry.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddCustomerBillSundry.fulfilled, (state, payload) => {
        state.loading = false;
        if (payload.payload.status) {
          state.billSundries.push(payload.payload.data);
        }
      })
      .addCase(fetchAddCustomerBillSundry.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerBillSundrySlice.reducer;
