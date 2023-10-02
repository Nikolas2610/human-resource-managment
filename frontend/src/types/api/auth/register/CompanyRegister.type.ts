export interface CompanyRegister {
    name: string;
    department_title: string;
    position_title: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    address: string;
    work_start_date: Date | null;
    email_company: string;
}
