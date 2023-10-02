const makeEditRoute = (base: string) => (id: number) => `${base}/edit/${id}`;
const makeViewRoute = (base: string) => (id: number) => `${base}/view/${id}`;

interface RouteListProps {
    register: string;
    registerWithParams: (packageName: string, duration: string) => string;
    profile: string;
    forgotPassword: string;
    resetPassword: string;
    dashboard: string;
    departments: string;
    createDepartment: string;
    editDepartment: (id: number) => string;
    viewDepartment: (id: number) => string;
    positions: string;
    createPosition: string;
    editPosition: (id: number) => string;
    employees: string;
    createEmployee: string;
    editEmployee: (id: number) => string;
    login: string;
    leaveTypes: string;
    createLeaveType: string;
    editLeaveType: (id: number) => string;
    leaveRequests: string;
    createLeaveRequest: string;
    settings: string;
    integrations: string;
    editCompanyContactInformation: string;
    companyCustomization: string;
    employeeDocuments: (employeeId: number) => string;
    companyEmployees: string;
    subscription: string;
    changeSubscriptionPlan: string;
    invoices: string;
}

const RouteList: RouteListProps = {
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    register: "/auth/register",
    registerWithParams: (packageName, duration) =>
        `/auth/register?package=${packageName}&duration=${duration}`,
    profile: "/profile",
    dashboard: "/dashboard",
    departments: "/departments",
    createDepartment: "/departments/create",
    editDepartment: makeEditRoute("/departments"),
    positions: "/positions",
    createPosition: "/positions/create",
    editPosition: makeEditRoute("/positions"),
    employees: "/employees",
    createEmployee: "/employees/create",
    companyEmployees: "/company/employees",
    editEmployee: makeEditRoute("/employees"),
    login: "/auth/login",
    leaveTypes: "/leave-types",
    createLeaveType: "/leave-types/create",
    editLeaveType: makeEditRoute("/leave-types"),
    leaveRequests: "/leave-request-history",
    createLeaveRequest: "/leave-request-post",
    viewDepartment: makeViewRoute("/departments"),
    settings: "/settings",
    integrations: "/settings/integrations",
    editCompanyContactInformation: "/settings/contact-information",
    companyCustomization: "/settings/customization",
    employeeDocuments: (employeeId) => `/employees/documents/${employeeId}`,
    subscription: "/settings/subscription",
    changeSubscriptionPlan: "/settings/subscription/change-subscription-plan",
    invoices: "/settings/subscription/invoices",
};

export default RouteList;
