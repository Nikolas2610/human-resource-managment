export interface NewLeaveType {
    type: string;
    limit: boolean;
    visible_to_employees: boolean;
    leave_amount: number | null
}