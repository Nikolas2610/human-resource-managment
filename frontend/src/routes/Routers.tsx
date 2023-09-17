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
import DashboardEmployeePage from "@/features/dashboard/pages/DashboardEmployeePage";
import ViewDepartment from "@/features/departments/pages/ViewDepartment";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import IntegrationsPage from "@/features/settings/pages/IntegrationsPage";
import CompanyCustomization from "@/features/settings/pages/CompanyCustomization";
import EditCompanyContactInformation from "@/features/settings/pages/EditCompanyContactInformation";
import { useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import { useGetCompanyQuery } from "@/features/companies/companiesEndpoints";
import { useThemeContext } from "@/contexts/DynamicThemeProvider";
import { useEffect } from "react";
import CompanyDetails from "@/features/companies/pages/CompanyDetails";
import EmployeeDocumentsPage from "@/features/employees/pages/EmployeeDocumentsPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import CompanyEmployeesPage from "@/features/companies/pages/CompanyEmployeesPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

export default function Routers() {
    const companyId = useSelector(selectCompany);
    const { data: company = null } = useGetCompanyQuery(companyId);
    const { setPrimaryColor } = useThemeContext();

    useEffect(() => {
        if (company && company.primary_color) {
            setPrimaryColor(company.primary_color);
        }
    }, [company]);

    return (
        <Routes>
            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                    path="forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route path="reset-password" element={<ResetPasswordPage />} />
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
                        element={<DashboardEmployeePage />}
                    />
                    <Route path="profile" element={<ProfilePage />} />
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
                        element={<CompanyDetails />}
                    />
                    <Route
                        path="company/employees"
                        element={<CompanyEmployeesPage />}
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
                        {/* Settings */}
                        <Route path="settings">
                            <Route path="" element={<SettingsPage />} />
                            <Route
                                path="integrations"
                                element={<IntegrationsPage />}
                            />
                            <Route
                                path="contact-information"
                                element={<EditCompanyContactInformation />}
                            />
                            <Route
                                path="customization"
                                element={<CompanyCustomization />}
                            />
                        </Route>

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
                        <Route
                            path="departments/view/:departmentId"
                            element={<ViewDepartment />}
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
                        <Route
                            path="employees/documents/:employeeId"
                            element={<EmployeeDocumentsPage />}
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
