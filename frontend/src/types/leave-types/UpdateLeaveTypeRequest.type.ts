import { LeaveType } from "./LeaveType.type";

export interface UpdateLeaveTypeRequest {
    companyId: number;
    leaveType: LeaveType
}