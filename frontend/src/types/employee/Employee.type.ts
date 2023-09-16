import { UserRole } from "@/features/auth/enums/UserRole";
import { Department } from "../departments/Department.type";
import { Position } from "../positions/Position.type";
import { NewEmployeeLeaveType } from "./NewEmployeeLeaveType.type";
import { TypeOfJob } from "@/features/employees/enums/TypeOfJob.enum";
import { Document } from "@/types/employee/Document.type";

export interface Employee {
    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    address: string;
    image: string;
    work_start_date: Date | string;
    work_end_date: Date | null;
    department: Department;
    position: Position;
    role: UserRole;
    salary: number;
    reports_to: {
        id: number;
        first_name: string;
        last_name: string;
    };
    leave_types?: NewEmployeeLeaveType[];
    personal_email?: string | null;
    birthday?: Date | string | null;
    name_day?: Date | string | null;
    married?: boolean;
    childs_count: number | null;
    type_of_job: TypeOfJob | null;
    documents?: Document[];
}
