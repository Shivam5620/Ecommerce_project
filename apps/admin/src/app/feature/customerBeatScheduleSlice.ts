import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ICreateCustomerBeatScheduleRequestBody,
  ICustomerBeatSchedule,
} from "@repo/ui/types/customerBeatSchedule";
import * as service from "../services/customerBeatSchedule";

export interface CustomerBeatSchedulesState {
  loading: boolean;
  customerBeatSchedules: ICustomerBeatSchedule[];
}

const initialState: CustomerBeatSchedulesState = {
  loading: false,
  customerBeatSchedules: [],
};

// Async Thunks for API calls
export const createCustomerBeatSchedule = createAsyncThunk(
  "customerBeatSchedules/add",
  async (data: ICreateCustomerBeatScheduleRequestBody) => {
    const response = await service.createCustomerBeatSchedule(data);
    return response.data;
  },
);

export const fetchAllCustomerBeatSchedule = createAsyncThunk(
  "customerBeatSchedules/all",
  async () => {
    const response = await service.fetchAllCustomerBeatSchedule();
    return response.data;
  },
);

export const updateCustomerBeatSchedule = createAsyncThunk(
  "customerBeatSchedule/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Partial<ICustomerBeatSchedule>>;
  }) => {
    const response = await service.updateCustomerBeatSchedule(id, data);
    return response.data;
  },
);
export const deleteCustomerBeatSchedule = createAsyncThunk(
  "customerBeatSchedules/delete",
  async (id: string) => {
    const response = await service.deleteCustomerBeatSchedule(id);
    return response.data;
  },
);
// Slice to handle state and actions
const customerBeatScheduleSlice = createSlice({
  name: "customerBeatSchedules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchAllCustomerBeats lifecycle
      .addCase(fetchAllCustomerBeatSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomerBeatSchedule.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.customerBeatSchedules = action.payload.data;
        }
      })
      .addCase(fetchAllCustomerBeatSchedule.rejected, (state) => {
        state.loading = false;
      })
      // Handle createCustomerBeatSchedule lifecycle
      .addCase(createCustomerBeatSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomerBeatSchedule.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.customerBeatSchedules = [
            ...state.customerBeatSchedules,
            ...action.payload.data,
          ];
        }
      })
      .addCase(createCustomerBeatSchedule.rejected, (state) => {
        state.loading = false;
      })
      // Handle updateCustomerBeat lifecycle
      .addCase(updateCustomerBeatSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerBeatSchedule.fulfilled, (state, action) => {
        state.loading = false;

        const customerBeatSchedules = [...state.customerBeatSchedules];

        const index = customerBeatSchedules.findIndex(
          (user) => user._id === action.payload.data?._id,
        );
        if (index !== -1) {
          customerBeatSchedules[index] = action.payload.data;
        }
        state.customerBeatSchedules = customerBeatSchedules;
      })
      .addCase(updateCustomerBeatSchedule.rejected, (state) => {
        state.loading = false;
      })
      // Handle deleteCustomerBeatSchedule lifecycle
      .addCase(deleteCustomerBeatSchedule.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomerBeatSchedule.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.customerBeatSchedules = state.customerBeatSchedules.filter(
            (schedule) => schedule._id !== action.payload.data._id,
          );
        }
      })
      .addCase(deleteCustomerBeatSchedule.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerBeatScheduleSlice.reducer;
