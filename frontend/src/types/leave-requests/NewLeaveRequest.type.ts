export interface NewLeaveRequest {
    leave_type_id: string | number;
    start_date: Date | null;
    end_date: Date | null;
    reason: string;
    days_requested: string | number;
}
