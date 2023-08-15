import { Omit } from "@reduxjs/toolkit/dist/tsHelpers";
import { LeaveType } from "./LeaveType.type";

export interface NewLeaveTypeRequest {
    companyId: number;
    leaveType: Omit<LeaveType, "id">
}