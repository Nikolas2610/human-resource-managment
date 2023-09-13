export interface NewEmployeeRequest {
    // employee: Omit<NewEmployee, "id">;
    employee: FormData;
    companyId: number;
}
