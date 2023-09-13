import { EmployeeAnniversary } from "../employee/EmployeeAnniversary";
import { LeaveRequest } from "../leave-requests/LeaveRequest.type";
import { NextBirthday } from "./NextBirthday.type";
import { NextNameDay } from "./NextNameDay.type";

export interface EmployeeDashboardData {
    celebrate_anniversaries: true;
    celebrate_birthdays: true;
    celebrate_name_days: true;
    leaveRequests: LeaveRequest[];
    anniversaries: EmployeeAnniversary[];
    nextBirthdays: NextBirthday[];
    nextNameDays: NextNameDay[];
}
