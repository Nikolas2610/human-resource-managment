import { Omit } from "@reduxjs/toolkit/dist/tsHelpers";
import { NewEmployee } from "./NewEmployee.type";

export interface UpdateEmployeeRequest  {
    employeeId: number;
    companyId: number;
    employee: Omit<NewEmployee, "password" | "password_confirmation">
}