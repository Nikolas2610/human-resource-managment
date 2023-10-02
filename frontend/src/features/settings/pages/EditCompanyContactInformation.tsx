import HeaderPageBackFeature from "@/components/ui/HeaderPageBackFeature";
import RouteList from "@/routes/RouteList";
import CompanyForm from "../components/CompanyForm";
import { useGetCompanyFullDetailsQuery } from "@/features/companies/companiesEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CompanyContactInformationForm } from "@/types/companies/CompanyContactInformationForm.type";
import usePageTitle from "@/hooks/usePageTitle";

export default function EditCompanyContactInformation() {
    const companyId = useSelector(selectCompany);
    const {
        data: company = null,
        isLoading,
        isError,
    } = useGetCompanyFullDetailsQuery(companyId);
    const [initialData, setInitialData] =
        useState<CompanyContactInformationForm | null>(null);
    usePageTitle("Edit Contact Information");

    useEffect(() => {
        if (company) {
            setInitialData({
                email_company: company.email_company,
                contact_email: company.contact_email,
                hr_mail: company.hr_mail,
                address: company.address,
                phone_number: company.phone_number,
                website: company.website,
                facebook: company.facebook,
                instagram: company.instagram,
                twitter: company.twitter,
                linkedin: company.linkedin,
                youtube: company.youtube,
                name: company.name,
                id: company.id,
            });
        }
    }, [company]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong</div>;
    }

    return (
        <>
            <HeaderPageBackFeature
                headerTitle="Edit Contact Information"
                to={RouteList.settings}
                buttonTitle="Back to Settings"
            />
            {initialData && <CompanyForm company={initialData} />}
        </>
    );
}
