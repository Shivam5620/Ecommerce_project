import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/itemGroup";
import { IItemGroup } from "@repo/ui/types/itemGroup";

export interface CustomerState {
  loading: boolean;
  itemGroups: IItemGroup[];
}

const initialState: CustomerState = {
  loading: false,
  itemGroups: [],
};

export const fetchAllItemGroups = createAsyncThunk(
  "itemGroup/all",
  async () => {
    const response = await service.fetchAllItemGroups();
    return response.data;
  },
);

export const fetchImportItemGroups = createAsyncThunk(
  "itemGroup/import",
  async () => {
    const response = await service.fetchImportItemGroups();
    return response.data;
  },
);

export const itemGroupsSlice = createSlice({
  name: "itemGroups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Item Groups
      .addCase(fetchAllItemGroups.pending, (state) => {
        state.loading = true;
        state.itemGroups = [];
      })
      .addCase(fetchAllItemGroups.fulfilled, (state, payload) => {
        state.loading = false;

        if (payload.payload.status) {
          state.itemGroups = payload.payload.data;
        }
      })
      .addCase(fetchAllItemGroups.rejected, (state) => {
        state.loading = false;
        state.itemGroups = [];
      })

      // Import Item Groups
      .addCase(fetchImportItemGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportItemGroups.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchImportItemGroups.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default itemGroupsSlice.reducer;
