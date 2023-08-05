import { Department } from "../departments/Department.type";

export interface Position {
    id: number;
    title: string;
    department: Department;
}