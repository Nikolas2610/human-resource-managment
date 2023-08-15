export interface LeaveType {
    id: number;
    type: string;
    leave_amount: number | null;
    limit: boolean;
    visible_to_employees: boolean;
}