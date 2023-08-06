import { NewEmployee } from "./NewEmployee.type";

export interface NewEmployeeRequest {
    employee: Omit<NewEmployee, "id">;
    companyId: number;
}
