import { Department } from "@/types/departments/Department.type";
import { apiService } from "../api/apiService";
import { NewDepartment } from "@/types/departments/NewDepartment.type";
import { ExistingDepartment } from "@/types/departments/ExistingDepartment.type";

export const departmentEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getDepartments: builder.query<Department[], number>({
            query: (companyId: number) => `companies/${companyId}/departments`,
            providesTags: (result, _error, _arg) =>
                result ? ["Department"] : [],
        }),
        getDepartment: builder.query<
            Department,
            { companyId: number; departmentId: number }
        >({
            query: ({ companyId, departmentId }) =>
                `companies/${companyId}/departments/${departmentId}`,
            providesTags: (_result, _error, { departmentId }) => [
                { type: "Department", id: departmentId },
            ],
        }),
        createDepartment: builder.mutation<void, NewDepartment>({
            query: ({ companyId, department }) => ({
                url: `companies/${companyId}/departments`,
                method: "POST",
                body: department,
            }),
            invalidatesTags: [{ type: "Department" }],
        }),
        editDepartment: builder.mutation<Department, ExistingDepartment>({
            query: ({ companyId, department }) => ({
                url: `companies/${companyId}/departments/${department.id}`,
                method: "PUT",
                body: department,
            }),
            // Only invalidate `Department` with a specific ID and `Departments` list
            invalidatesTags: [{ type: "Department" }],
        }),
        deleteDepartment: builder.mutation<
            void,
            { companyId: number; departmentId: number }
        >({
            query: ({ companyId, departmentId }) => ({
                url: `companies/${companyId}/departments/${departmentId}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Department" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetDepartmentQuery,
    useGetDepartmentsQuery,
    useCreateDepartmentMutation,
    useEditDepartmentMutation,
    useDeleteDepartmentMutation,
} = departmentEndpoints;
