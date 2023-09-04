import { Company } from "@/types/companies/Company.type";
import { apiService } from "../api/apiService";
import { UpdateCompanyCustomizationRequest } from "@/types/companies/UpdateCompanyCustomizationRequest.type";

export const companyEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getCompany: builder.query<Company, number>({
            query: (companyId: number) => `companies/${companyId}`,
            providesTags: (result, _error, _arg) => (result ? ["Company"] : []),
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
    }),
});

export const { useGetCompanyQuery, useUpdateCompanyCustomizationMutation } =
    companyEndpoints;
