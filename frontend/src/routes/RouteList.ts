const RouteList: RouteListProps = {
    departments: "/departments",
    createDepartment: "/departments/create",
    editDepartment: (id: number) => `/departments/edit/${id}`
};

interface RouteListProps {
    departments: string;
    createDepartment: string;
    editDepartment: (id: number) => string;
}

export default RouteList;
