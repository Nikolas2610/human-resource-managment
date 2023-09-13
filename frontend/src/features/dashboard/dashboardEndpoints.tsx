import { EmployeeDashboardData } from "@/types/dashboard/EmployeeDashboardData.type";
import { apiService } from "../api/apiService";

export const dashboardEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        // getEmployeeDashboardData: builder.query<EmployeeDashboardData, number>({
        //     query: (companyId: number) =>
        //         `companies/${companyId}/dashboard/employee`,
        //     providesTags: (result, _error, _arg) =>
        //         result ? ["Company", "LeaveRequest", "Employee"] : [],
        // }),
        // getDashboardData: builder.query<EmployeeDashboardData, number>({
        //     query: (companyId: number) =>
        //         `companies/${companyId}/dashboard/employee`,
        //     providesTags: (result, _error, _arg) =>
        //         result ? ["Company", "LeaveRequest", "Employee"] : [],
        // }),
        getEmployeeDashboardData: builder.query<EmployeeDashboardData, number>({
            query: (companyId) =>
                `companies/${companyId}/dashboard/employee`,
            providesTags: (result, _error, _arg) =>
                result ? ["Company", "LeaveRequest", "Employee"] : [],
        }),
    }),
});

export const {
    useGetEmployeeDashboardDataQuery,
} = dashboardEndpoints;
