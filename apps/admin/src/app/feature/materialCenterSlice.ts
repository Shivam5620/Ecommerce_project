import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMaterialCenter } from "@repo/ui/types/materialCenter";
import * as service from "../services/materialCenter";

export interface MaterialCenterState {
  loading: boolean;
  materialCenters: Array<IMaterialCenter>;
}

const initialState: MaterialCenterState = {
  loading: false,
  materialCenters: [],
};

export const fetchMaterialCenters = createAsyncThunk(
  "materialCenters/fetchAll",
  async () => {
    const response = await service.fetchAllMaterialCenters();
    return response.data.data;
  },
);

export const fetchAddMaterialCenter = createAsyncThunk(
  "materialCenters/add",
  async (data: Partial<IMaterialCenter>) => {
    const response = await service.fetchAddMaterialCenter(data);
    return response.data.data;
  },
);

export const fetchUpdateMaterialCenter = createAsyncThunk(
  "materialCenters/update",
  async ({ id, data }: { id: string; data: Partial<IMaterialCenter> }) => {
    const response = await service.fetchUpdateMaterialCenter(id, data);
    return response.data.data;
  },
);

export const materialCenterSlice = createSlice({
  name: "materialCenters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch MaterialCenters
      .addCase(fetchMaterialCenters.pending, (state) => {
        state.loading = true;
        state.materialCenters = [];
      })
      .addCase(
        fetchMaterialCenters.fulfilled,
        (state, action: PayloadAction<Array<IMaterialCenter>>) => {
          state.loading = false;
          state.materialCenters = action.payload;
        },
      )
      .addCase(fetchMaterialCenters.rejected, (state) => {
        state.loading = false;
        state.materialCenters = [];
      })
      // Add MaterialCenter
      .addCase(fetchAddMaterialCenter.pending, (state) => {
        state.loading = true;
        state.materialCenters = [];
      })
      .addCase(
        fetchAddMaterialCenter.fulfilled,
        (state, action: PayloadAction<IMaterialCenter>) => {
          state.loading = false;
          state.materialCenters.push(action.payload);
        },
      )
      .addCase(fetchAddMaterialCenter.rejected, (state) => {
        state.loading = false;
        state.materialCenters = [];
      })
      // Update MaterialCenter
      .addCase(fetchUpdateMaterialCenter.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUpdateMaterialCenter.fulfilled,
        (state, action: PayloadAction<IMaterialCenter>) => {
          state.loading = false;
          state.materialCenters = state.materialCenters.map((materialCenter) =>
            materialCenter._id === action.payload._id
              ? action.payload
              : materialCenter,
          );
        },
      )
      .addCase(fetchUpdateMaterialCenter.rejected, (state) => {
        state.loading = false;
        state.materialCenters = [];
      });
  },
});

export default materialCenterSlice.reducer;
