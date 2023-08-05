export interface NewDepartment {
    companyId: number;
    department: Omit<{ id?: number | string; name: string }, "id">;
}
