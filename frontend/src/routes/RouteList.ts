const makeEditRoute = (base: string) => (id: number) => `${base}/edit/${id}`;
const makeViewRoute = (base: string) => (id: number) => `${base}/view/${id}`;

interface RouteListProps {
    register: string;
    profile: string;
    dashboard: string;
    departments: string;
    createDepartment: string;
    editDepartment: (id: number) => string;
    viewDepartment: (id: number) => string;
    positions: string;
    createPosition: string;
    editPosition: (id: number) => string;
    employees: string,
    createEmployee: string,
    editEmployee:(id: number) => string;
    login: string;
    leaveTypes: string;
    createLeaveType: string;
    editLeaveType: (id: number) => string;
    leaveRequests: string;
    createLeaveRequest: string
}

const RouteList: RouteListProps = {
    register: "/auth/register",
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
    editEmployee: makeEditRoute("/employees"),
    login: "/auth/login",
    leaveTypes: "/leave-types",
    createLeaveType: "/leave-types/create",
    editLeaveType: makeEditRoute("/leave-types"),
    leaveRequests: "/leave-request-history",
    createLeaveRequest: "/leave-request-post",
    viewDepartment: makeViewRoute("/departments")

};

export default RouteList;
