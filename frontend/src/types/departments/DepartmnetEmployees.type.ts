import { UserRole } from "@/features/auth/enums/UserRole";

export interface DepartmentEmployees {
    id: number;
    name: string;
    manager_name: string | null;
    employees: DepartmentEmployee[];
}

interface DepartmentEmployee {
    id: number;
    name: string;
    image: string | null;
    email: string;
    address: string;
    role: UserRole;
    salary: number | null;
    phone: string;
    reports_to: string | null;
    position: string;
    leaves: Leaves[];
}

interface Leaves {
    allocated_leaves: number;
    used_leaves: number;
    remaining_leaves: number;
    unavailable_leaves: number;
    type: string;
}
