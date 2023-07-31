import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Employee } from "../../types/employee/Employee.type";
import { LoginArgs } from "../../types/api/auth/login/Login.type";

interface AuthState {
    user: Employee | null;
    token: string | null;
    form: LoginArgs;
}

const initialState: AuthState = {
    user: null,
    token: null,
    form: {
        email: "john.doe@example.com",
        password: "Password-0",
    },
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
            action: PayloadAction<{ employee: Employee; token: string }>
        ) => {
            const { employee, token } = action.payload;
            state.user = employee;
            state.token = token;
            localStorage.setItem("token", token);
        },
        logout: (state) => {
            localStorage.removeItem("token");
            state.user = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUser: (state, action: PayloadAction<Employee>) => {
            state.user = action.payload;
        },
    },
});

// Selectors
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectCompany = (state: RootState) => state.auth.user?.company_id;

// Export actions
export const {
    logout,
    loginUser,
    onChangeLoginField,
    setToken,
    setUser,
} = authSlice.actions;

export default authSlice.reducer;