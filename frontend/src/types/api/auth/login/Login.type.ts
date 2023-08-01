import { Employee } from "../../../employee/Employee.type";

export interface LoginResult {
   employee: Employee, 
   token: string;
}

export interface LoginArgs {
    email: string;
    password: string;
}
