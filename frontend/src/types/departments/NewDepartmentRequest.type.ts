export interface NewDepartmentRequest {
    companyId: number;
    department: Omit<{ id?: number | string; name: string, manager_id?: string | number | null }, "id">;
}
