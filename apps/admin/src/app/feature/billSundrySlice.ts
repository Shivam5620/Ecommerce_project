import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/billSundry";
import { IBillSundry } from "@repo/ui/types/billSundry";

export interface CustomerState {
  loading: boolean;
  billSundries: IBillSundry[];
}

const initialState: CustomerState = {
  loading: false,
  billSundries: [],
};

export const fetchAllBillSundries = createAsyncThunk(
  "billSundry/all",
  async () => {
    const response = await service.fetchAllBillSundries();
    return response.data;
  },
);

export const fetchImportBillSundries = createAsyncThunk(
  "billSundry/import",
  async () => {
    const response = await service.fetchImportBillSundries();
    return response.data;
  },
);

export const billSundriesSlice = createSlice({
  name: "billSundries",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Bill Sundries
      .addCase(fetchAllBillSundries.pending, (state) => {
        state.loading = true;
        state.billSundries = [];
      })
      .addCase(fetchAllBillSundries.fulfilled, (state, payload) => {
        state.loading = false;

        if (payload.payload.status) {
          state.billSundries = payload.payload.data;
        }
      })
      .addCase(fetchAllBillSundries.rejected, (state) => {
        state.loading = false;
        state.billSundries = [];
      })

      // Import Bill Sundries
      .addCase(fetchImportBillSundries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportBillSundries.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchImportBillSundries.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default billSundriesSlice.reducer;
