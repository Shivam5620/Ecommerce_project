import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IChangePasswordBody, ILoginBody } from "@repo/ui/types/auth";
import { IUser } from "@repo/ui/types/user";
import * as service from "../services/auth";

export interface AuthState {
  user: IUser | null;
  logged_in: boolean;
  loading: boolean;
  error: boolean;
}

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }: ILoginBody) => {
    const response = await service.fetchLogin({ email, password });
    return response.data;
  },
);

export const fetchLogout = createAsyncThunk("auth/logout", async () => {
  const response = await service.fetchLogout();
  return response.data;
});

export const fetchChangePassword = createAsyncThunk(
  "auth/change-password",
  async (data: IChangePasswordBody) => {
    const response = await service.fetchChangePassword(data);
    return response.data;
  },
);

const initialState: AuthState = {
  user: null,
  logged_in: false,
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.logged_in = true;
        state.loading = false;
      })
      .addCase(fetchLogin.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.user = null;
        state.logged_in = false;
        state.loading = false;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchChangePassword.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchChangePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchChangePassword.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default authSlice.reducer;
