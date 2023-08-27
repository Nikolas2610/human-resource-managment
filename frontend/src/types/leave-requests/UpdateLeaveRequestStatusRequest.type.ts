import { LeaveRequestApprovalStatus } from "@/features/leave-requests/enums/LeaveRequestApprovalStatus.enum";

export interface UpdateLeaveRequestStatusRequest {
    leaveRequest: {
        status: LeaveRequestApprovalStatus;
    };
    leaveRequestId: number;
    companyId: number;
}
