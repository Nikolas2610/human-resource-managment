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

            <Route element={<PrivateRoute roles={["employee", "hr"]} />}>
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
                        element={<div>Employee - Post Leave Request</div>}
                    />
                    <Route
                        path="leave-request-history"
                        element={<div>Employee - History Leave Request</div>}
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

                    {/* HR routes */}
                    <Route element={<PrivateRoute roles={["hr"]} />}>
                        <Route
                            path="integrations"
                            element={<div>HR - Integrations</div>}
                        />
                        <Route
                            path="approve-leave"
                            element={<div>HR - Approve Leave</div>}
                        />
                        <Route
                            path="edit-company"
                            element={<div>HR - Edit company info</div>}
                        />

                        {/* Departments CRUD */}
                        <Route path="departments" element={<Departments />} />
                        <Route
                            path="departments/create"
                            element={<CreateDepartment />}
                        />
                        <Route
                            path="departments/edit/:departmentId"
                            element={<EditDepartment />}
                        />

                        {/* Positions CRUD */}
                        <Route path="positions" element={<PositionsPage />} />
                        <Route
                            path="positions/create"
                            element={<CreatePositionPage />}
                        />
                        <Route
                            path="positions/edit/:positionId"
                            element={<EditPositionPage />}
                        />

                        {/* Employees CRUD */}
                        <Route path="employees" element={<EmployeesPage />} />
                        <Route path="employees/create" element={<CreateEmployee />} />
                        <Route path="employees/edit/:employeeId" element={<EditEmployee />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
