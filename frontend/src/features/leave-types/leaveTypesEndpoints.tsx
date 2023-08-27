import { LeaveType } from "@/types/leave-types/LeaveType.type";
import { apiService } from "../api/apiService";
import { NewLeaveTypeRequest } from "@/types/leave-types/NewLeaveTypeRequest.type";
import { UpdateLeaveTypeRequest } from "@/types/leave-types/UpdateLeaveTypeRequest.type";
import { EmployeeLeaves } from "@/types/leave-types/EmployeeLeaves.type";

export const leaveTypesEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getLeaveTypes: builder.query<LeaveType[], number>({
            query: (companyId: number) => `companies/${companyId}/leave-types`,
            providesTags: (result, _error, _arg) =>
                result ? ["LeaveType"] : [],
        }),
        getLeaveType: builder.query<
            LeaveType,
            { companyId: number; leaveTypeId: number }
        >({
            query: ({ companyId, leaveTypeId }) =>
                `companies/${companyId}/leave-types/${leaveTypeId}`,
            providesTags: (_result, _error, { leaveTypeId }) => [
                { type: "LeaveType", id: leaveTypeId },
            ],
        }),
        getEmployeeLeaves: builder.query<EmployeeLeaves[], number>({
            query: (companyId: number) =>
                `companies/${companyId}/leave-types/employee`,
        }),
        createLeaveType: builder.mutation<void, NewLeaveTypeRequest>({
            query: ({ companyId, leaveType }) => ({
                url: `companies/${companyId}/leave-types`,
                method: "POST",
                body: leaveType,
            }),
            invalidatesTags: [{ type: "LeaveType" }],
        }),
        updateLeaveType: builder.mutation<LeaveType, UpdateLeaveTypeRequest>({
            query: ({ companyId, leaveType }) => ({
                url: `companies/${companyId}/leave-types/${leaveType.id}`,
                method: "PUT",
                body: leaveType,
            }),
            invalidatesTags: [{ type: "LeaveType" }],
        }),
        deleteLeaveType: builder.mutation<
            void,
            { companyId: number; leaveTypeId: number }
        >({
            query: ({ companyId, leaveTypeId }) => ({
                url: `companies/${companyId}/leave-types/${leaveTypeId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "LeaveType" }],
        }),
    }),
});

export const {
    useGetLeaveTypeQuery,
    useGetLeaveTypesQuery,
    useGetEmployeeLeavesQuery,
    useCreateLeaveTypeMutation,
    useUpdateLeaveTypeMutation,
    useDeleteLeaveTypeMutation,
} = leaveTypesEndpoints;
