import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateLoadingRequestBody, ILoading } from "@repo/ui/types/loading";
import * as service from "../services/loading";

export interface LoadingState {
  loading: boolean;
  loadings: ILoading[];
}

const initialState: LoadingState = {
  loading: false,
  loadings: [],
};

export const fetchLoadings = createAsyncThunk("loadings/fetchAll", async () => {
  const response = await service.fetchLoadings();
  return response.data;
});

export const fetchAddLoading = createAsyncThunk(
  "loadings/add",
  async (data: ICreateLoadingRequestBody) => {
    const response = await service.fetchAddLoading(data);
    return response.data;
  },
);

export const fetchUpdateLoading = createAsyncThunk(
  "loadings/update",
  async ({ id, data }: { id: string; data: Partial<ILoading> }) => {
    const response = await service.fetchUpdateLoading(id, data);
    return response.data;
  },
);

export const loadingSlice = createSlice({
  name: "loadings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Loadings
      .addCase(fetchLoadings.pending, (state) => {
        state.loading = true;
        state.loadings = [];
      })
      .addCase(fetchLoadings.fulfilled, (state, action) => {
        state.loading = false;
        state.loadings = action.payload.data;
      })
      .addCase(fetchLoadings.rejected, (state) => {
        state.loading = false;
        state.loadings = [];
      })

      // Add Loading
      .addCase(fetchAddLoading.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddLoading.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.loadings = [...state.loadings, action.payload.data];
        }
      })
      .addCase(fetchAddLoading.rejected, (state) => {
        state.loading = false;
      })

      // Update Loading
      .addCase(fetchUpdateLoading.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateLoading.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          const loadings = [...state.loadings];
          const index = loadings.findIndex(
            (user) => user._id === action.payload.data?._id,
          );
          if (index !== -1) {
            loadings[index] = action.payload.data;
          }
          state.loadings = loadings;
        }
      })
      .addCase(fetchUpdateLoading.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default loadingSlice.reducer;
