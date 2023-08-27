const makeEditRoute = (base: string) => (id: number) => `${base}/edit/${id}`;

interface RouteListProps {
    dashboard: string;
    departments: string;
    createDepartment: string;
    editDepartment: (id: number) => string;
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
    login: "auth/login",
    leaveTypes: "/leave-types",
    createLeaveType: "/leave-types/create",
    editLeaveType: makeEditRoute("/leave-types"),
    leaveRequests: "/leave-request-history",
    createLeaveRequest: "/leave-request-post"

};

export default RouteList;
