import { Employee } from "@/types/employee/Employee.type";
import { apiService } from "../api/apiService";
import { NewEmployeeRequest } from "@/types/employee/NewEmployeeRequest.type";
import { UpdateEmployeeRequest } from "@/types/employee/UpdateEmployeeRequest.type";
import { EmployeeAnniversary } from "@/types/employee/EmployeeAnniversary";
import { Document } from "@/types/documents/Document.type";
import { DocumentRequest } from "@/types/documents/DocumentRequest.type";

export const employeesEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query<Employee[], number>({
            query: (companyId: number) => `companies/${companyId}/employees`,
            providesTags: (result, _error, _arg) =>
                result ? ["Employee"] : [],
        }),
        getEmployeesAnniversaries: builder.query<EmployeeAnniversary[], number>(
            {
                query: (companyId: number) =>
                    `companies/${companyId}/employees/anniversaries`,
            }
        ),
        getEmployee: builder.query<
            Employee,
            { companyId: number; employeeId: number }
        >({
            query: ({ companyId, employeeId }) =>
                `companies/${companyId}/employees/${employeeId}`,
            providesTags: (_result, _error, { employeeId }) => [
                { type: "Employee", id: employeeId },
            ],
        }),
        getEmployeeDocuments: builder.query<
            Document[],
            { companyId: number; employeeId: number | string }
        >({
            query: ({ companyId, employeeId }) =>
                `companies/${companyId}/employees/${employeeId}/documents`,
            providesTags: (_result, _error, { employeeId }) => [
                { type: "EmployeeDocuments", id: employeeId },
            ],
        }),
        storeDocument: builder.mutation<Document, DocumentRequest>({
            query: ({ companyId, formData }) => {
                return {
                    url: `companies/${companyId}/documents`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: [{ type: "EmployeeDocuments" }],
        }),
        deleteDocument: builder.mutation<
            void,
            { companyId: number; id: number }
        >({
            query: ({ companyId, id }) => ({
                url: `companies/${companyId}/documents/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "EmployeeDocuments" }],
        }),
        createEmployee: builder.mutation<void, NewEmployeeRequest>({
            query: ({ companyId, employee }) => ({
                url: `companies/${companyId}/employees`,
                method: "POST",
                body: employee,
            }),
            invalidatesTags: [
                { type: "Employee" },
                { type: "Department" },
                { type: "Position" },
            ],
        }),
        updateEmployee: builder.mutation<Employee, UpdateEmployeeRequest>({
            query: ({ companyId, employeeId, employee }) => ({
                url: `companies/${companyId}/employees/${employeeId}`,
                method: "POST",
                body: employee,
            }),
            invalidatesTags: [
                { type: "Employee" },
                { type: "Department" },
                { type: "Position" },
            ],
        }),
        deleteEmployee: builder.mutation<
            void,
            { companyId: number; employeeId: number }
        >({
            query: ({ companyId, employeeId }) => ({
                url: `companies/${companyId}/employees/${employeeId}`,
                method: "DELETE",
            }),
            invalidatesTags: [
                { type: "Employee" },
                { type: "Department" },
                { type: "Position" },
            ],
        }),
        resetPasswordByRequest: builder.mutation<
            void,
            { companyId: number; employeeId: number }
        >({
            query: ({ companyId, employeeId }) => ({
                url: `companies/${companyId}/employees/${employeeId}/reset-password`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeQuery,
    useGetEmployeeDocumentsQuery,
    useGetEmployeesAnniversariesQuery,
    useStoreDocumentMutation,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useResetPasswordByRequestMutation,
    useDeleteEmployeeMutation,
    useDeleteDocumentMutation,
} = employeesEndpoints;
