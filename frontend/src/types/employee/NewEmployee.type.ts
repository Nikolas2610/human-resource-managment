import { UserRole } from "@/features/auth/enums/UserRole";
import { NewEmployeeLeaveType } from "./NewEmployeeLeaveType.type";
import { TypeOfJob } from "@/features/employees/enums/TypeOfJob.enum";
import { Dayjs } from "dayjs";
import { Document } from "@/types/employee/Document.type"

export interface NewEmployee {
    first_name: string;
    active: boolean;
    last_name: string;
    address: string;
    phone: number;
    work_start_date: Dayjs | Date | null;
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
    documents?: Document[];
    personal_email?: string | null;
    birthday?: Dayjs | Date | null;
    name_day?: Dayjs | Date | null;
    married? : boolean;
    childs_count?: number | null;
    type_of_job?: TypeOfJob | null;
    image?: string | null;
}
