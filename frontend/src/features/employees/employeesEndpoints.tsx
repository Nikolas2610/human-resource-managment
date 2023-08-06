import { Employee } from "@/types/employee/Employee.type";
import { apiService } from "../api/apiService";
import { NewEmployeeRequest } from "@/types/employee/NewEmployeeRequest.type";
import { UpdateEmployeeRequest } from "@/types/employee/UpdateEmployeeRequest.type";

export const employeesEndpoints = apiService.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query<Employee[], number>({
            query: (companyId: number) => `companies/${companyId}/employees`,
            providesTags: (result, _error, _arg) =>
                result ? ["Employee"] : [],
        }),
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
        createEmployee: builder.mutation<void, NewEmployeeRequest>({
            query: ({ companyId, employee }) => ({
                url: `companies/${companyId}/employees`,
                method: "POST",
                body: employee,
            }),
            invalidatesTags: [{ type: "Employee" }],
        }),
        updateEmployee: builder.mutation<Employee, UpdateEmployeeRequest>({
            query: ({ companyId, employeeId, employee }) => ({
                url: `companies/${companyId}/employees/${employeeId}`,
                method: "PATCH",
                body: employee,
            }),
            invalidatesTags: [{ type: "Employee" }],
        }),
    }),
});

export const {
    useGetEmployeesQuery,
    useGetEmployeeQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} = employeesEndpoints;