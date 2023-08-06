import { UserRole } from "../../features/auth/enums/UserRole";

export interface UserEmployee {
    id: number;
    company_id: number;
    department_id: number;
    position_id: number;
    first_name: string;
    last_name: string;
    email: string;
    image: string | null;
    role: UserRole;
}