import { NeaLeaveRequestApiRequest } from "@/types/leave-requests/NewLeaveRequestApiRequest.type";
import { apiService } from "../api/apiService";
import { LeaveRequest } from "@/types/leave-requests/LeaveRequest.type";
import { UpdateLeaveRequestStatusRequest } from "@/types/leave-requests/UpdateLeaveRequestStatusRequest.type";

export const leaveRequestsEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeeLeaveRequest: builder.query<LeaveRequest[], number>({
            query: (companyId: number) =>
                `companies/${companyId}/leave-requests/employee`,
            providesTags: (result, _error, _arg) =>
                result ? ["LeaveRequestEmployee"] : [],
        }),
        getManagerLeaveRequest: builder.query<LeaveRequest[], number>({
            query: (companyId: number) =>
                `companies/${companyId}/leave-requests/manager`,
            providesTags: (result, _error, _arg) =>
                result ? ["LeaveRequest"] : [],
        }),
        // getLeaveRequests: builder.query<LeaveType[], number>({
        //     query: (companyId: number) => `companies/${companyId}/leave-types`,
        //     providesTags: (result, _error, _arg) =>
        //         result ? ["LeaveType"] : [],
        // }),
        // getLeaveType: builder.query<
        //     LeaveType,
        //     { companyId: number; leaveTypeId: number }
        // >({
        //     query: ({ companyId, leaveTypeId }) =>
        //         `companies/${companyId}/leave-types/${leaveTypeId}`,
        //     providesTags: (_result, _error, { leaveTypeId }) => [
        //         { type: "LeaveType", id: leaveTypeId },
        //     ],
        // }),
        createLeaveRequest: builder.mutation<void, NeaLeaveRequestApiRequest>({
            query: ({ companyId, leaveRequest }) => ({
                url: `companies/${companyId}/leave-requests`,
                method: "POST",
                body: leaveRequest,
            }),
            invalidatesTags: [
                { type: "LeaveRequest" },
                { type: "LeaveRequestEmployee" },
            ],
        }),
        updateLeaveRequestStatus: builder.mutation<LeaveRequest, UpdateLeaveRequestStatusRequest>({
            query: ({ companyId, leaveRequest, leaveRequestId }) => ({
                url: `companies/${companyId}/leave-requests/${leaveRequestId}/status-update`,
                method: "PUT",
                body: leaveRequest,
            }),
            invalidatesTags: [{ type: "LeaveRequest" }],
        }),
        // deleteLeaveType: builder.mutation<
        //     void,
        //     { companyId: number; leaveTypeId: number }
        // >({
        //     query: ({ companyId, leaveTypeId }) => ({
        //         url: `companies/${companyId}/leave-types/${leaveTypeId}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: [{ type: "LeaveType" }],
        // }),
    }),
});

export const {
    useCreateLeaveRequestMutation,
    useGetEmployeeLeaveRequestQuery,
    useGetManagerLeaveRequestQuery,
    useUpdateLeaveRequestStatusMutation
} = leaveRequestsEndpoints;
