import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as service from "../services/shipment";
import { IOrder } from "@repo/ui/types/order";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import { ICreateShipmentRequestBody } from "@repo/ui/types/shipment";

export interface ShipmentState {
  loading: boolean;
  orders: Array<IOrder>;
  dispatches: Array<IOrderDispatch>;
}

const initialState: ShipmentState = {
  loading: false,
  orders: [],
  dispatches: [],
};

export const fetchDispatchesToShip = createAsyncThunk(
  "shipments/dispatches",
  async () => {
    const response = await service.fetchDispatchesToShip();

    if (response.data.status) {
      return response.data.data;
    } else {
      return [];
    }
  },
);

export const fetchShipDispatch = createAsyncThunk(
  "shipments/create",
  async ({ id, data }: { id: string; data: ICreateShipmentRequestBody }) => {
    const response = await service.fetchShipDispatch(id, data);

    if (response.data.status) {
      return response.data.data;
    } else {
      return null;
    }
  },
);

export const shipmentSlice = createSlice({
  name: "shipments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dispatches to Ship
      .addCase(fetchDispatchesToShip.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDispatchesToShip.fulfilled, (state, action) => {
        state.loading = false;
        state.dispatches = action.payload;
      })
      .addCase(fetchDispatchesToShip.rejected, (state) => {
        state.loading = false;
      })

      // Create Shipment
      .addCase(fetchShipDispatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShipDispatch.fulfilled, (state, action) => {
        state.loading = false;

        // Update dispatch
        if (action.payload) {
          state.dispatches = state.dispatches.filter(
            (dispatch) => dispatch.dispatch_id !== action.payload?.dispatch_id,
          );
        }
      })
      .addCase(fetchShipDispatch.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default shipmentSlice.reducer;
