import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface DashboardResult {
  // Define the shape of the response from the 'dashboard' endpoint here
}

export const apiService = createApi({
  reducerPath: 'apiService',
  baseQuery: fetchBaseQuery({ baseUrl: '/your-api-url' }),
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResult, void>({
      query: () => 'dashboard',
    }),
  }),
});

export const { useGetDashboardQuery } = apiService;