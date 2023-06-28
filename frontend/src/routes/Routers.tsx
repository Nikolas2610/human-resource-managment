import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../features/auth/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../features/auth/pages/LoginPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<div>Register</div>} />
        <Route path="forgot-password" element={<div>Forgot password</div>} />
        <Route path="reset-password" element={<div>Reset password</div>} />
      </Route>

      <Route element={<PrivateRoute roles={["employee", "hr"]} />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<div>Employee - Dashboard</div>} />
          <Route path="profile" element={<div>Employee - Profile</div>} />
          <Route
            path="leave-request/post"
            element={<div>Employee - Post Leave Request</div>}
          />
          <Route
            path="leave-request/history"
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
          <Route path="documents" element={<div>Employee - Documents</div>} />

          <Route element={<PrivateRoute roles={["hr"]} />}>
            <Route path="integrations" element={<div>HR - Integrations</div>} />
            <Route
              path="approve-leave"
              element={<div>HR - Approve Leave</div>}
            />
            <Route
              path="edit-company"
              element={<div>HR - Edit company info</div>}
            />
            <Route path="employees" element={<div>HR - Edit employees</div>} />
            <Route path="departments" element={<div>HR - Departments</div>} />
            <Route path="positions" element={<div>HR - Positions</div>} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
