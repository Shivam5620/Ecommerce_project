import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as service from "../services/role";
import { IRole } from "@repo/ui/types/role";
import { IPermission } from "@repo/ui/types/permission";
import { APIResponse } from "@repo/ui/types/response";

export interface RoleState {
  loading: boolean;
  roles: IRole[];
  permissions: IPermission[];
}

const initialState: RoleState = {
  loading: false,
  roles: [],
  permissions: [],
};

export const fetchCreateRole = createAsyncThunk(
  "role/create",
  async (data: IRole) => {
    const response = await service.fetchCreateRole(data);
    return response.data;
  },
);

export const fetchAllRole = createAsyncThunk("role/all", async () => {
  const response = await service.fetchAllRoles();
  return response.data.data;
});

export const fetchAllPermission = createAsyncThunk(
  "roles/permissions",
  async () => {
    const response = await service.fetchAllPermissions();
    return response.data.data;
  },
);

export const fetchUpdateRole = createAsyncThunk(
  "role/update",
  async ({ id, data }: { id: string; data: Partial<IRole> }) => {
    const response = await service.fetchUpdateRole(id, data);
    return response.data;
  },
);
export const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Role
      .addCase(fetchCreateRole.pending, (state: RoleState) => {
        state.loading = true;
      })
      .addCase(
        fetchCreateRole.fulfilled,
        (
          state: RoleState,
          action: PayloadAction<APIResponse<IRole | null>>,
        ) => {
          state.loading = false;
          if (action.payload.status && action.payload.data) {
            state.roles = [...state.roles, action.payload.data];
          }
        },
      )
      .addCase(fetchCreateRole.rejected, (state: RoleState) => {
        state.loading = false;
      })

      // allRoles
      .addCase(fetchAllRole.pending, (state: RoleState) => {
        state.loading = true;
      })
      .addCase(
        fetchAllRole.fulfilled,
        (state: RoleState, action: PayloadAction<Array<IRole>>) => {
          state.loading = false;
          state.roles = action.payload;
        },
      )
      .addCase(fetchAllRole.rejected, (state: RoleState) => {
        state.loading = false;
      })

      // Permissions
      .addCase(fetchAllPermission.pending, (state: RoleState) => {
        state.loading = true;
      })
      .addCase(
        fetchAllPermission.fulfilled,
        (state: RoleState, action: PayloadAction<IPermission[]>) => {
          state.loading = false;
          state.permissions = action.payload;
        },
      )
      .addCase(fetchAllPermission.rejected, (state: RoleState) => {
        state.loading = false;
      })

      // Update Role
      .addCase(fetchUpdateRole.pending, (state: RoleState) => {
        state.loading = true;
      })
      .addCase(
        fetchUpdateRole.fulfilled,
        (
          state: RoleState,
          action: PayloadAction<APIResponse<IRole | null>>,
        ) => {
          console.log("Update fulfilled", action.payload);
          state.loading = false;
          if (action.payload.status) {
            const index = state.roles.findIndex(
              (role) => role._id === action.payload.data?._id,
            );
            if (index !== -1 && action.payload.data) {
              state.roles[index] = action.payload.data;
            }
          }
        },
      )
      .addCase(fetchUpdateRole.rejected, (state: RoleState) => {
        state.loading = false;
      });
  },
});

export default roleSlice.reducer;
