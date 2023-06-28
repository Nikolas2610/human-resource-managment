import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "./enums/UserRole";
import { RootState } from "../../app/store";

interface AuthState {
  user: { role: string } | null;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ role: UserRole }>) => {
      localStorage.setItem("token", "token");
      state.user = action.payload;
      state.isLoading = false;
    },
    loginFailure: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
});

// Selectors
export const selectUserRole = (state: RootState) => state.auth.user?.role;

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
