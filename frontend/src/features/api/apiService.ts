import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginArgs, LoginResult } from "../../types/api/auth/login/Login.type";
import { Employee } from "../../types/employee/Employee.type";

export const apiService = createApi({
    reducerPath: "apiService",
    tagTypes: ["Department"],
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
        getUser: builder.query<Employee, void>({
            query: () => "user",
        }),
    }),
});

export const { useLoginMutation, useGetUserQuery } = apiService;
