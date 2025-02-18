import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IBilty } from "@repo/ui/types/bilty";
import { IOrderDispatch } from "@repo/ui/types/orderDispatch";
import * as service from "../services/bilty";

export interface BiltyState {
  loading: boolean;
  biltys: IBilty[];
  dispatches: IOrderDispatch[];
}

const initialState: BiltyState = {
  loading: false,
  biltys: [],
  dispatches: [],
};

// Thunks
export const fetchAddBilty = createAsyncThunk(
  "bilty/add",
  async (data: FormData) => {
    const response = await service.addBilty(data);
    return response.data.data;
  },
);

export const fetchAllBiltys = createAsyncThunk("bilty/all", async () => {
  const response = await service.getBiltys();
  return response.data;
});

export const fetchDispatchesByTransportAndDate = createAsyncThunk(
  "bilty/dispatches",
  async (params: { vehicle_number: string; date: string }) => {
    const response = await service.getDispatchesByTransportAndDate(
      params.vehicle_number,
      params.date,
    );
    return response.data;
  },
);

export const biltySlice = createSlice({
  name: "biltys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Bilty
      .addCase(fetchAddBilty.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddBilty.fulfilled, (state, action) => {
        state.loading = false;
        state.biltys = [...state.biltys, action.payload];
      })
      .addCase(fetchAddBilty.rejected, (state) => {
        state.loading = false;
      })

      // Get All Biltys
      .addCase(fetchAllBiltys.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBiltys.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.biltys = action.payload.data;
        }
      })
      .addCase(fetchAllBiltys.rejected, (state) => {
        state.loading = false;
      })

      // Get Dispatches
      .addCase(fetchDispatchesByTransportAndDate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDispatchesByTransportAndDate.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.dispatches = action.payload.data;
        }
      })
      .addCase(fetchDispatchesByTransportAndDate.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default biltySlice.reducer;
