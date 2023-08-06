import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginArgs, LoginResult } from "../../types/api/auth/login/Login.type";
import { UserEmployee } from "../../types/employee/UserEmployee.type";

export const apiService = createApi({
    reducerPath: "apiService",
    tagTypes: ["Department", "Position", "Employee"],
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
        getUser: builder.query<UserEmployee, void>({
            query: () => "user",
        }),
        logout: builder.mutation<void, void>({  // <-- Add this section
            query: () => ({
                url: "employee/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useLoginMutation, useGetUserQuery, useLogoutMutation } = apiService;
