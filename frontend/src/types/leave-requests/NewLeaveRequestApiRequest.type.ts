export interface NeaLeaveRequestApiRequest {
    companyId: number;
    leaveRequest: {
        leave_type_id: string | number;
        start_date: string;
        end_date: string;
        reason: string;
        days_requested: string | number;
    };
}
