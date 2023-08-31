export interface EmployeeLeaves {
    id: number;
    type: string;
    limit: boolean;
    leave_amount?: number;
    allocated_leaves: number;
    used_leaves: number;
    remaining_leaves: number;
    year: string;
    visible_to_employees: boolean;
}