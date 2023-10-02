import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginArgs, LoginResult } from "../../types/api/auth/login/Login.type";
import { UserEmployee } from "../../types/employee/UserEmployee.type";
import { CompanyRegister } from "@/types/api/auth/register/CompanyRegister.type";
import { Company } from "@/types/companies/Company.type";
import { ResetPasswordRequest } from "@/types/auth/ResetPasswordRequest.type";
import { RegisterResponse } from "@/types/api/auth/login/RegisterResponse.type";

export const apiService = createApi({
    reducerPath: "apiService",
    tagTypes: [
        "Department",
        "Position",
        "Employee",
        "LeaveType",
        "LeaveRequest",
        "LeaveRequestEmployee",
        "Company",
        "EmployeeDocuments",
        "CompanySubscription",
        "Invoices"
    ],
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/api",
        prepareHeaders(headers) {
            const token: string | null = localStorage.getItem("token");
            if (token) {
                // Append the Authorization header
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        registerCompany: builder.mutation<RegisterResponse, CompanyRegister>({
            query: (body) => ({
                url: "companies",
                method: "POST",
                body,
            }),
        }),
        login: builder.mutation<LoginResult, LoginArgs>({
            query: ({ email, password }) => ({
                url: "employee/login",
                method: "POST",
                body: {
                    email,
                    password,
                },
            }),
        }),
        getUser: builder.query<UserEmployee, void>({
            query: () => "user",
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "employee/logout",
                method: "POST",
            }),
        }),
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: "employee/forgot-password",
                method: "POST",
                body: {
                    email,
                },
            }),
        }),
        resetPassword: builder.mutation<
            { message: string; status: string },
            ResetPasswordRequest
        >({
            query: (data) => ({
                url: "employee/reset-password",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterCompanyMutation,
    useGetUserQuery,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = apiService;
