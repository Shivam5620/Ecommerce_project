import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICreateOrderRequestBody, IOrder } from "@repo/ui/types/order";
import * as service from "../services/order";

// Define a type for the slice state
export interface OrderState {
  loading: boolean;
  order: IOrder | null;
}

// Define the initial state using that type
const initialState: OrderState = {
  loading: false,
  order: null,
};

export const fetchAddOrder = createAsyncThunk(
  "order/add",
  async (data: ICreateOrderRequestBody) => {
    const response = await service.addOrder(data);
    return response.data.data;
  },
);

export const orderSlice = createSlice({
  name: "orders",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddOrder.pending, (state) => {
        state.loading = true;
        state.order = null;
      })
      .addCase(
        fetchAddOrder.fulfilled,
        (state, action: PayloadAction<IOrder>) => {
          state.loading = false;
          state.order = action.payload;
        },
      )
      .addCase(fetchAddOrder.rejected, (state) => {
        state.loading = false;
        state.order = null;
      });
  },
});

// export const {} = orderSlice.actions;

export default orderSlice.reducer;
