import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICreateUserRequestBody, IUser } from "@repo/ui/types/user";
import * as service from "../services/user";

export interface UserState {
  loading: boolean;
  users: IUser[];
}

const initialState: UserState = {
  loading: false,
  users: [],
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const response = await service.fetchUsers();
  return response.data;
});

export const fetchAddUser = createAsyncThunk(
  "users/add",
  async (data: ICreateUserRequestBody) => {
    const response = await service.fetchAddUser(data);
    return response.data;
  },
);

export const fetchUpdateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: Partial<IUser> }) => {
    const response = await service.fetchUpdateUser(id, data);
    return response.data;
  },
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.users = [];
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.users = [];
      })

      // Add User
      .addCase(fetchAddUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = [...state.users, action.payload.data];
      })
      .addCase(fetchAddUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        const users = [...state.users];
        const index = users.findIndex(
          (user) => user._id === action.payload.data._id,
        );
        if (index !== -1) {
          users[index] = action.payload.data;
        }
        state.users = users;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
