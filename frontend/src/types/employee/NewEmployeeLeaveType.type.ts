export interface NewEmployeeLeaveType {
    leave_type_id: number;
    allocated_leaves: number;
    used_leaves: number;
    unavailable_leaves: number;
    year: number;
    leave_type: string;
}