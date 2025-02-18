import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import * as service from "../services/transport";
import { IOrder } from "@repo/ui/types/order";

export interface TransportState {
  loading: boolean;
  orders: Array<IOrder>;
}

const initialState: TransportState = {
  loading: false,
  orders: [],
};

export const fetchOrdersToTransport = createAsyncThunk(
  "transport/orders",
  async () => {
    const response = await service.fetchOrdersToTransport();

    // console.log('API Response:', response.data);

    if (response.data.status) {
      return response.data.data;
    } else {
      return [];
    }
  },
);

export const addNewTransport = createAsyncThunk(
  "transport/add",
  async (data: any) => {
    const response = await service.addTransport(data);
    if (response.data.status) {
      return response.data.data;
    } else {
      return [];
    }
  },
);

export const transportSlice = createSlice({
  name: "transports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersToTransport.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOrdersToTransport.fulfilled,
        (state, action: PayloadAction<IOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchOrdersToTransport.rejected, (state) => {
        state.loading = false;
      });
    //.addCase(addNewTransport.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(addNewTransport.fulfilled, (state, action: PayloadAction<any>) => {
    //   state.loading = false;
    //   state.orders.push(action.payload);
    // })
    // .addCase(addNewTransport.rejected, (state) => {
    //   state.loading = false;
    // });
  },
});

export default transportSlice.reducer;

// export const {} = orderSlice.actions;
