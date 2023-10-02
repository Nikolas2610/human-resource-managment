import { Company } from "@/types/companies/Company.type";
import { apiService } from "../api/apiService";
import { UpdateCompanyCustomizationRequest } from "@/types/companies/UpdateCompanyCustomizationRequest.type";
import { CompanyFullDetails } from "@/types/companies/CompanyFullDetails.type";
import { CompanyContactInformationForm } from "@/types/companies/CompanyContactInformationForm.type";
import { CompanyIntegrationSettingsRequest } from "@/types/companies/CompanyIntegrationsSettingsRequest.type";
import { CompanyDepartment } from "@/types/companies/CompanyDepartment.type";
import { CompanySubscription } from "@/types/companies/CompanySubscription.type";

export const companyEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getCompany: builder.query<Company, number>({
            query: (companyId: number) => `companies/${companyId}`,
            providesTags: (result, _error, _arg) => (result ? ["Company"] : []),
        }),
        getCompanyFullDetails: builder.query<CompanyFullDetails, number>({
            query: (companyId: number) => `companies/${companyId}/details`,
            providesTags: (result, _error, _arg) => (result ? ["Company"] : []),
        }),
        getEmployeesCompanyByDepartment: builder.query<
            CompanyDepartment[],
            number
        >({
            query: (companyId: number) =>
                `companies/${companyId}/get-company-employees`,
            providesTags: (result, _error, _arg) =>
                result ? ["Company", "Employee"] : [],
        }),
        getCompanySubscription: builder.query<CompanySubscription, number>({
            query: (companyId: number) =>
                `companies/${companyId}/subscriptions`,
            providesTags: (result, _error, _arg) => (result ? ["CompanySubscription"] : []),
        }),
        updateCompanyCustomization: builder.mutation<
            void,
            UpdateCompanyCustomizationRequest
        >({
            query: ({ companyId, formData }) => ({
                url: `companies/${companyId}/updateCustomization`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [{ type: "Company" }],
        }),
        updateCompany: builder.mutation<void, CompanyContactInformationForm>({
            query: (company) => ({
                url: `companies/${company.id}`,
                method: "PUT",
                body: company,
            }),
            invalidatesTags: [{ type: "Company" }],
        }),
        updateCompanyIntegrations: builder.mutation<
            void,
            CompanyIntegrationSettingsRequest
        >({
            query: (company) => ({
                url: `companies/${company.id}`,
                method: "PUT",
                body: company,
            }),
            invalidatesTags: [{ type: "Company" }],
        }),
    }),
});

export const {
    useGetCompanyQuery,
    useGetEmployeesCompanyByDepartmentQuery,
    useGetCompanySubscriptionQuery,
    useUpdateCompanyCustomizationMutation,
    useGetCompanyFullDetailsQuery,
    useUpdateCompanyMutation,
    useUpdateCompanyIntegrationsMutation,
} = companyEndpoints;
