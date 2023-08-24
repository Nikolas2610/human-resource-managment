import { UserRole } from "@/features/auth/enums/UserRole";
import { NewEmployeeLeaveType } from "./NewEmployeeLeaveType.type";

export interface NewEmployee {
    first_name: string;
    active: boolean;
    last_name: string;
    address: string;
    phone: number;
    work_start_date: Date;
    password: string;
    password_confirmation: string;
    email: string;
    department_id: number;
    position_id: number;
    companyId: number;
    role: UserRole;
    salary?: number;
    reports_to?: number;
    leave_types?: NewEmployeeLeaveType[];
}
