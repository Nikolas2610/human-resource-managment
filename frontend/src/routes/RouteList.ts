const makeEditRoute = (base: string) => (id: number) => `${base}/edit/${id}`;

interface RouteListProps {
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
}

const RouteList: RouteListProps = {
    departments: "/departments",
    createDepartment: "/departments/create",
    editDepartment: makeEditRoute("/departments"),
    positions: "/positions",
    createPosition: "/positions/create",
    editPosition: makeEditRoute("/positions"),
    employees: "/employees",
    createEmployee: "/employees/create",
    editEmployee: makeEditRoute("/employees"),
    login: "auth/login"
};

export default RouteList;
