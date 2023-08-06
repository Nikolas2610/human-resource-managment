import { UserEmployee } from "../../../employee/UserEmployee.type";

export interface LoginResult {
   employee: UserEmployee, 
   token: string;
}

export interface LoginArgs {
    email: string;
    password: string;
}
