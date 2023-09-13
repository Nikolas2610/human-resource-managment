import { Company } from "./Company.type";

export interface CompanyFullDetails extends Company {
    email_company: string | null;
    address: string | null;
    phone_number: string | null;
    contact_email: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    linkedin: string | null;
    youtube: string | null;
}
