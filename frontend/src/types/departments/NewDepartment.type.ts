import { Department } from "./Department.type";

export interface NewDepartment {
    companyId: number;
    department: Omit<{ id?: number; name: string }, "id">;
}
