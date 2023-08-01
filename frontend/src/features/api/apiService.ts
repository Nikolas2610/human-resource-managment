import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginArgs, LoginResult } from "../../types/api/auth/login/Login.type";
import { Employee } from "../../types/employee/Employee.type";
import { Department } from "../../types/departments/Department.type";

interface DashboardResult {
    // Define the shape of the response from the 'dashboard' endpoint here
}

export const apiService = createApi({
    reducerPath: "apiService",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/api",
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query<DashboardResult, void>({
            query: () => "dashboard",
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
    }),
});

export const apiServiceWithAuth = createApi({
    reducerPath: "apiServiceWithAuth",
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
        getUser: builder.query<Employee, void>({
            query: () => "user",
        }),
        getDepartments: builder.query<Department[], number>({
            query: (companyId: number) => `companies/${companyId}/departments`,
        }),
    }),
});

export const { useGetDashboardQuery, useLoginMutation } = apiService;
export const { useGetUserQuery, useGetDepartmentsQuery } = apiServiceWithAuth;
