import { LeaveRequestApprovalStatus } from "@/features/leave-requests/enums/LeaveRequestApprovalStatus.enum";
import { LeaveRequestStatus } from "@/features/leave-requests/enums/LeaveRequestStatus.enum";

export interface LeaveRequest {
    id: number;
    employee_id: number;
    employee_name: string;
    employee_image: string;
    department: {
        id: number;
        name: string;
    };
    leave_type_id: number;
    leave_type_name: string;
    start_date: string;
    status: LeaveRequestStatus;
    end_date: string;
    reason: string;
    days_requested: number;
    manager_approved: LeaveRequestApprovalStatus;
    hr_approved: LeaveRequestApprovalStatus;
    created_at: Date;
}
