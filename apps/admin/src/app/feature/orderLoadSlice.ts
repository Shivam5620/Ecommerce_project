import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as service from "../services/orderLoad";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";

export interface OrderLoadState {
  loading: boolean;
  dispatches: Array<IOrderDispatch>;
}

const initialState: OrderLoadState = {
  loading: false,
  dispatches: [],
};

export const fetchDispatchesToLoad = createAsyncThunk(
  "orderLoad/dispatches",
  async () => {
    const response = await service.fetchDispatchesToLoad();
    return response.data;
  },
);

export const fetchAddOrderLoad = createAsyncThunk(
  "orderLoad/add",
  async (data: FormData) => {
    const response = await service.fetchAddOrderLoad(data);
    return response.data;
  },
);

export const orderLoadSlice = createSlice({
  name: "orderLoads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatchesToLoad.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDispatchesToLoad.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.dispatches = action.payload.data;
        }
      })
      .addCase(fetchDispatchesToLoad.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchAddOrderLoad.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddOrderLoad.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status && action.payload.data) {
          // Remove the shipments received back
          state.dispatches = state.dispatches.filter((dispatch) => {
            return !action.payload.data.dispatch_ids.includes(
              String(dispatch._id),
            );
          });
        }
      })
      .addCase(fetchAddOrderLoad.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default orderLoadSlice.reducer;
