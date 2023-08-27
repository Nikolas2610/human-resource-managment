import { Company } from "@/types/companies/Company.type";
import { apiService } from "../api/apiService";

export const companyEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getCompany: builder.query<Company, number>({
            query: (companyId: number) =>
                `companies/${companyId}`,
            providesTags: (result, _error, _arg) => (result ? ["Company"] : []),
        }),
    }),
});

export const { useGetCompanyQuery } = companyEndpoints;
