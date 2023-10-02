import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { UserEmployee } from "../../types/employee/UserEmployee.type";
import { LoginArgs } from "../../types/api/auth/login/Login.type";
import { UserRole } from "./enums/UserRole";

interface AuthState {
    user: UserEmployee | null;
    token: string | null;
    form: LoginArgs;
    role: UserRole;
    isUserLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    form: {
        email: "john.doe@example.com",
        password: "Password-0",
    },
    role: UserRole.GUEST,
    isUserLoading: true
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        onChangeLoginField: (
            state,
            action: PayloadAction<{ key: "email" | "password"; value: string }>
        ) => {
            state.form[action.payload.key] = action.payload.value;
        },
        loginUser: (
            state,
            action: PayloadAction<{ employee: UserEmployee; token: string }>
        ) => {
            const { employee, token } = action.payload;
            state.user = employee;
            state.token = token;
            state.role = employee.role;
            localStorage.setItem("token", token);
        },
        logoutUser: (state) => {
            localStorage.removeItem("token");
            state.user = null;
            state.role = UserRole.GUEST;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUser: (state, action: PayloadAction<UserEmployee | null>) => {
            state.user = action.payload;
            state.role = action.payload?.role ?? UserRole.GUEST;
            state.isUserLoading = false;
        },
    },
});

// Selectors
export const selectUserRole = (state: RootState) =>
    state.auth.role ?? UserRole.GUEST;
export const selectUserID = (state: RootState) => state.auth.user?.id ?? 0;
export const selectCompany = (state: RootState): number =>
    state.auth.user?.company_id ?? 0;

// Export actions
export const { logoutUser, loginUser, onChangeLoginField, setToken, setUser } =
    authSlice.actions;

export default authSlice.reducer;
