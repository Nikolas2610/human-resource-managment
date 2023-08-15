import { UserRole } from "@/features/auth/enums/UserRole";
import { Department } from "../departments/Department.type";
import { Position } from "../positions/Position.type";

export interface Employee {
    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    address: string;
    image: string;
    work_start_date: Date;
    work_end_date: Date | null;
    department: Department;
    position: Position;
    managed_departments: Department;
    // TODO: Add the type LeaveAmounts
    leave_amounts: any;
    role: UserRole;
    salary: number;
    reports_to: {
        id: number;
        first_name: string;
        last_name: string;
    }
}