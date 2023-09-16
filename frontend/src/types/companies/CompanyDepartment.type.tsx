export interface CompanyDepartment {
    department_id: number;
    department_name: string;
    employees: DepartmentEmployee[];
}

interface DepartmentEmployee {
    id: number;
    name: string;
    position: string;
    email: string;
    phone: string;
    work_duration: string;
    work_start_date: string;
    reports_to: string;
    reports_to_image: string | null;
    image: string | null;
}
