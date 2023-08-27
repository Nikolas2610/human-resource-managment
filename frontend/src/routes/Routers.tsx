import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../features/auth/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../features/auth/pages/LoginPage";
import Departments from "../features/departments/pages/Departments";
import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import CreateDepartment from "../features/departments/pages/CreateDepartment";
import EditDepartment from "../features/departments/pages/EditDepartment";
import PositionsPage from "@/features/positions/pages/PositionsPage";
import CreatePositionPage from "@/features/positions/pages/CreatePositionPage";
import EditPositionPage from "@/features/positions/pages/EditPositionPage";
import EmployeesPage from "@/features/employees/pages/EmployeesPage";
import CreateEmployee from "@/features/employees/pages/CreateEmployee";
import EditEmployee from "@/features/employees/pages/EditEmployee";
import LeaveTypesPage from "@/features/leave-types/pages/LeaveTypesPage";
import CreateLeaveType from "@/features/leave-types/pages/CreateLeaveType";
import EditLeaveType from "@/features/leave-types/pages/EditLeaveType";
import CreateLeaveRequest from "@/features/leave-requests/pages/CreateLeaveRequest";
import LeaveRequestsPage from "@/features/leave-requests/pages/LeaveRequestsPage";
import LeaveRequestsApproved from "@/features/leave-requests/pages/LeaveRequestsApproved";
import { UserRole } from "@/features/auth/enums/UserRole";

export default function Routers() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<div>Register</div>} />
                <Route
                    path="forgot-password"
                    element={<div>Forgot password</div>}
                />
                <Route
                    path="reset-password"
                    element={<div>Reset password</div>}
                />
            </Route>

            <Route
                element={
                    <PrivateRoute
                        roles={[
                            UserRole.EMPLOYEE,
                            UserRole.HR,
                            UserRole.MANAGER,
                        ]}
                    />
                }
            >
                <Route path="/" element={<DashboardLayout />}>
                    <Route
                        path="dashboard"
                        element={<div>Employee - Dashboard</div>}
                    />
                    <Route
                        path="profile"
                        element={<div>Employee - Profile</div>}
                    />
                    <Route
                        path="leave-request-post"
                        element={<CreateLeaveRequest />}
                    />
                    <Route
                        path="leave-request-history"
                        element={<LeaveRequestsPage />}
                    />
                    <Route
                        path="company-details"
                        element={<div>Employee - Company Details</div>}
                    />
                    <Route
                        path="employees-details"
                        element={<div>Employee - Employees details</div>}
                    />
                    <Route
                        path="documents"
                        element={<div>Employee - Documents</div>}
                    />

                    <Route
                        element={
                            <PrivateRoute
                                roles={[UserRole.HR, UserRole.MANAGER]}
                            />
                        }
                    >
                        <Route
                            path="approve-leave"
                            element={<LeaveRequestsApproved />}
                        />
                    </Route>

                    {/* HR routes */}
                    <Route element={<PrivateRoute roles={[UserRole.HR]} />}>
                        <Route
                            path="integrations"
                            element={<div>HR - Integrations</div>}
                        />

                        <Route
                            path="edit-company"
                            element={<div>HR - Edit company info</div>}
                        />

                        {/* Departments CRUD - HR */}
                        <Route path="departments" element={<Departments />} />
                        <Route
                            path="departments/create"
                            element={<CreateDepartment />}
                        />
                        <Route
                            path="departments/edit/:departmentId"
                            element={<EditDepartment />}
                        />

                        {/* Positions CRUD - HR */}
                        <Route path="positions" element={<PositionsPage />} />
                        <Route
                            path="positions/create"
                            element={<CreatePositionPage />}
                        />
                        <Route
                            path="positions/edit/:positionId"
                            element={<EditPositionPage />}
                        />

                        {/* Employees CRUD - HR */}
                        <Route path="employees" element={<EmployeesPage />} />
                        <Route
                            path="employees/create"
                            element={<CreateEmployee />}
                        />
                        <Route
                            path="employees/edit/:employeeId"
                            element={<EditEmployee />}
                        />

                        {/* Leave Types CRUD - HR */}
                        <Route
                            path="leave-types"
                            element={<LeaveTypesPage />}
                        />
                        <Route
                            path="leave-types/create"
                            element={<CreateLeaveType />}
                        />
                        <Route
                            path="leave-types/edit/:leaveTypeId"
                            element={<EditLeaveType />}
                        />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
