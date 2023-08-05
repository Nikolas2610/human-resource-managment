export interface ExistingDepartment {
    companyId: number;
    department: {
        id?: number | string;
        name: string;
    };
}
