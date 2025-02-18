import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as service from "../services/orderDispatch";
import {
  IGetOrderDispatchQuery,
  IOrderDispatch,
  IPaginatedOrderDispatchQuery,
} from "@repo/ui/types/orderDispatch";
import { PaginatedData } from "@repo/ui/types/paginate";
import { defaultPaginatedData } from "@repo/ui/lib/constants";

// Define a type for the slice state
export interface OrderDispatchState {
  loading: boolean;
  dispatches: Array<IOrderDispatch>;
  logs: PaginatedData<IOrderDispatch>;
}

// Define the initial state using that type
const initialState: OrderDispatchState = {
  loading: false,
  dispatches: [],
  logs: defaultPaginatedData,
};

export const fetchWpOrderLogs = createAsyncThunk(
  "dispatch/paginated-dispatches",
  async (query: IPaginatedOrderDispatchQuery) => {
    const response = await service.fetchWpOrderLogs(query);
    return response.data.data;
  },
);

export const fetchOrderDispatches = createAsyncThunk(
  "order/dispatches",
  async (query: IGetOrderDispatchQuery): Promise<IOrderDispatch[]> => {
    const response = await service.fetchOrderDispatches(query);
    return response.data.data;
  },
);

export const fetchOrderDispatchById = createAsyncThunk(
  "order/id",
  async (id: string): Promise<IOrderDispatch | null> => {
    const response = await service.fetchOrderDispatchById(id);
    return response.data.data;
  },
);

export const dispatchSlice = createSlice({
  name: "dispatches",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWpOrderLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchWpOrderLogs.fulfilled,
        (state, action: PayloadAction<PaginatedData<IOrderDispatch>>) => {
          state.loading = false;
          state.logs = action.payload;
        },
      )
      .addCase(fetchWpOrderLogs.rejected, (state) => {
        state.loading = false;
      })

      // Order Dispatches
      .addCase(fetchOrderDispatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDispatches.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.dispatches = action.payload;
        }
      })
      .addCase(fetchOrderDispatches.rejected, (state) => {
        state.loading = false;
      })

      // Order Dispatch By Id
      .addCase(fetchOrderDispatchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderDispatchById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.dispatches = [action.payload];
        }
      })
      .addCase(fetchOrderDispatchById.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dispatchSlice.reducer;
