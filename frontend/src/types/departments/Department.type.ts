export interface Department{
    id: number | string;
    name: string;
    company_id: number;
    num_employees: number;
    manager?: {
        id: number;
        first_name: string;
        last_name: string;
    }
}