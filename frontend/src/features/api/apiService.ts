import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { LoginArgs, LoginResult } from "../../types/api/auth/login/Login.type";
import { Employee } from "../../types/employee/Employee.type";
import { Department } from "../../types/departments/Department.type";
import { NewDepartment } from "../../types/departments/NewDepartment.type";
import { ExistingDepartment } from "../../types/departments/ExistingDepartment.type";

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

export const apiServiceWithAuth = createApi<any, any, any, any>({
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
            providesTags: [{ type: "Departments", id: "LIST" }],
        }),
        createDepartment: builder.mutation<void, NewDepartment>({
            query: ({ companyId, department }) => ({
                url: `companies/${companyId}/departments`,
                method: "POST",
                body: department,
            }),
            invalidatesTags: [{ type: "Departments", id: "LIST" }],
        }),
        editDepartment: builder.mutation<void, ExistingDepartment>({
            query: ({ companyId, department }) => ({
                url: `companies/${companyId}/departments/${department.id}`,
                method: "PUT",
                body: department,
            }),
            invalidatesTags: [{ type: "Departments", id: "LIST" }],
        }),
    }),
});

export const { useGetDashboardQuery, useLoginMutation } = apiService;
export const {
    useGetUserQuery,
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
} = apiServiceWithAuth;
