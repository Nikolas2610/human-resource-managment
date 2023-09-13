export interface Company {
    id: number;
    name: string;
    require_manager_approval: boolean;
    require_hr_approval: boolean;
    celebrate_birthdays: boolean;
    celebrate_name_days: boolean;
    celebrate_anniversaries: boolean;
    logo: string;
    administrator_mail: string | null;
    hr_mail: string | null;
    primary_color: string | null;
    secondary_color: string | null;
}