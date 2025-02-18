import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/customerBeats";
import {
  ICreateCustomerBeatRequestBody,
  ICustomerBeat,
} from "@repo/ui/types/customerBeat";

// Define the state structure
export interface CustomerBeatsState {
  loading: boolean;
  customerBeats: ICustomerBeat[];
}

const initialState: CustomerBeatsState = {
  loading: false,
  customerBeats: [],
};

// Fetch all customer beats
export const fetchAllCustomerBeats = createAsyncThunk(
  "customer-beats/all",
  async () => {
    const response = await service.fetchAllCustomerBeats();
    return response.data; // Ensure this matches the API response structure
  },
);

// Create a new customer beat
export const createCustomerBeat = createAsyncThunk(
  "customerBeats/create",
  async (newBeat: ICreateCustomerBeatRequestBody) => {
    const response = await service.createCustomerBeat(newBeat);
    return response.data; // Return the created beat data from the API
  },
);

// Update an existing customer beat
export const updateCustomerBeat = createAsyncThunk(
  "customerBeats/update",
  async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<ICreateCustomerBeatRequestBody>;
  }) => {
    const response = await service.updateCustomerBeat(id, data);
    return response.data; // Return the updated beat data from the API
  },
);

const customerBeatSlice = createSlice({
  name: "customerBeats",
  initialState,
  reducers: {}, // No synchronous reducers needed for now
  extraReducers: (builder) => {
    builder
      // Handle fetchAllCustomerBeats lifecycle
      .addCase(fetchAllCustomerBeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomerBeats.fulfilled, (state, action) => {
        state.loading = false;
        state.customerBeats = action.payload.data;
      })
      .addCase(fetchAllCustomerBeats.rejected, (state) => {
        state.loading = false;
      })
      // Handle createCustomerBeat lifecycle
      .addCase(createCustomerBeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomerBeat.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.status) {
          state.customerBeats = [...state.customerBeats, action.payload.data];
        }
      })
      .addCase(createCustomerBeat.rejected, (state) => {
        state.loading = false;
      })
      // Handle updateCustomerBeat lifecycle
      .addCase(updateCustomerBeat.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomerBeat.fulfilled, (state, action) => {
        state.loading = false;
        const customerBeats = [...state.customerBeats];
        const index = customerBeats.findIndex(
          (beat) => beat._id === action.payload.data._id,
        );
        if (index !== -1) {
          customerBeats[index] = action.payload.data;
        }
        state.customerBeats = customerBeats;
      })
      .addCase(updateCustomerBeat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default customerBeatSlice.reducer;
