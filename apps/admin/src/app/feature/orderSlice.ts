import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IBatchOrdersRequestBody,
  ICancelOrdersRequestBody,
  ICreateOrderRequestBody,
  IGetOrdersQuery,
  IGetPaginatedOrdersQuery,
  IOrder,
  IUpdateOrderRequestBody,
} from "@repo/ui/types/order";
import * as service from "../services/order";

// Define a type for the slice state
export interface OrderState {
  loading: boolean;
  dispatchLoading: boolean;
  updateLoading: boolean;
  orders: Array<IOrder>;
  pagination: {
    totalPages: number;
    totalDocs: number;
    page: number;
    limit: number;
  };
}

// Define the initial state using that type
const initialState: OrderState = {
  loading: false,
  dispatchLoading: false,
  updateLoading: false,
  orders: [],
  pagination: {
    totalPages: 0,
    totalDocs: 0,
    page: 1,
    limit: 10,
  },
};

export const fetchAddOrder = createAsyncThunk(
  "order/add",
  async (data: ICreateOrderRequestBody) => {
    const response = await service.addOrder(data);
    return response.data.data;
  },
);

export const fetchAllOrders = createAsyncThunk(
  "order/all",
  async (params: IGetOrdersQuery) => {
    const response = await service.fetchAllOrders(params);
    return response.data.data;
  },
);
export const fetchPaginatedOrders = createAsyncThunk(
  "order/fetchPaginated",
  async (params: IGetPaginatedOrdersQuery) => {
    const response = await service.fetchPaginatedOrders(params);
    return response.data.data;
  },
);
export const fetchWpOrders = createAsyncThunk(
  "order/wp-orders",
  async (params: IGetOrdersQuery) => {
    const response = await service.fetchWpOrders(params);
    return response.data.data;
  },
);

export const fetchOrderById = createAsyncThunk(
  "order/id",
  async (id: string): Promise<IOrder | null> => {
    const response = await service.fetchOrderById(id);
    return response.data.data;
  },
);

export const fetchCancelOrders = createAsyncThunk(
  "order/cancel",
  async (data: ICancelOrdersRequestBody) => {
    const response = await service.fetchCancelOrder(data);
    return response.data.data;
  },
);

export const fetchBatchOrders = createAsyncThunk(
  "order/batch",
  async (data: IBatchOrdersRequestBody) => {
    const response = await service.fetchBatchOrder(data);
    return response.data.data;
  },
);

export const fetchDispatchOrder = createAsyncThunk(
  "order/dispatch",
  async ({ id, data }: { id: string; data: FormData }) => {
    console.log({ id, data });
    const response = await service.fetchDispatchOrder(id, data);
    return response.data;
  },
);

export const fetchUpdateOrder = createAsyncThunk(
  "order/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<IUpdateOrderRequestBody>;
  }) => {
    const response = await service.fetchUpdateOrder(id, data);
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
      })
      .addCase(fetchAddOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(fetchAddOrder.rejected, (state) => {
        state.loading = false;
      })

      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.loading = false;
      })
      // fetch paginated orders
      .addCase(fetchPaginatedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaginatedOrders.fulfilled, (state, action) => {
        state.loading = false;
        const { docs, totalDocs, totalPages, limit, page } = action.payload;
        state.orders = docs;
        state.pagination = {
          totalDocs,
          totalPages,
          page: page || 1,
          limit,
        };
      })
      .addCase(fetchPaginatedOrders.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Wp Orders
      .addCase(fetchWpOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWpOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchWpOrders.rejected, (state) => {
        state.loading = false;
      })

      // Cancel Orders
      .addCase(fetchCancelOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCancelOrders.fulfilled, (state, action) => {
        state.loading = false;

        const orders = [...state.orders];
        for (const newOrder of action.payload) {
          const orderIndex = orders.findIndex(
            (o) => o.order_id === newOrder.order_id,
          );
          if (orderIndex === -1) continue;
          orders[orderIndex] = newOrder;
        }
        state.orders = orders;
      })
      .addCase(fetchCancelOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchBatchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBatchOrders.fulfilled, (state, action) => {
        state.loading = false;

        const orders = [...state.orders];
        for (const newOrder of action.payload) {
          const orderIndex = orders.findIndex(
            (o) => o.order_id === newOrder.order_id,
          );
          if (orderIndex === -1) continue;
          orders[orderIndex] = newOrder;
        }
        state.orders = orders;
      })
      .addCase(fetchBatchOrders.rejected, (state) => {
        state.loading = false;
      })

      // Dispatch Order
      .addCase(fetchDispatchOrder.pending, (state) => {
        state.dispatchLoading = true;
      })
      .addCase(fetchDispatchOrder.fulfilled, (state, action) => {
        state.dispatchLoading = false;
        if (action.payload.status) {
          const orders = state.orders.filter(
            (o) => o._id !== action.payload.data.order_id,
          );
          state.orders = orders;
        }
      })
      .addCase(fetchDispatchOrder.rejected, (state) => {
        state.dispatchLoading = false;
      })

      // Dispatch Logs
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.orders = [action.payload];
        }
      })
      .addCase(fetchOrderById.rejected, (state) => {
        state.loading = false;
      })

      // Update Order
      .addCase(fetchUpdateOrder.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(fetchUpdateOrder.fulfilled, (state, action) => {
        state.updateLoading = false;
        const orders = [...state.orders];
        const index = orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          orders[index] = action.payload;
        }
        state.orders = orders;
      })
      .addCase(fetchUpdateOrder.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

export default orderSlice.reducer;
