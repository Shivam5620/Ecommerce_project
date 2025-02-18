import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/customer";
import { ICustomer } from "@repo/ui/types/customer";

export interface CustomerState {
  loading: boolean;
  customers: ICustomer[];
}

const initialState: CustomerState = {
  loading: false,
  customers: [],
};

export const fetchAllCustomers = createAsyncThunk("customer/all", async () => {
  const response = await service.fetchAllCustomers();
  return response.data;
});

export const fetchImportCustomers = createAsyncThunk(
  "customer/import",
  async () => {
    const response = await service.fetchImportCustomers();
    return response.data;
  },
);

export const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All Customers
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.customers = action.payload.data;
        }
      })
      .addCase(fetchAllCustomers.rejected, (state) => {
        state.loading = false;
      })

      // Import Customers
      .addCase(fetchImportCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportCustomers.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchImportCustomers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerSlice.reducer;
