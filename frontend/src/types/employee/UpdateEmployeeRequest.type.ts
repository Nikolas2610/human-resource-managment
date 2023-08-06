import { NewEmployeeRequest } from "./NewEmployeeRequest.type";

export interface UpdateEmployeeRequest extends NewEmployeeRequest {
    employeeId: number;
}