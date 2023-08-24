import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import RouteList from "@/routes/RouteList";
import {
    DataGrid,
    GridToolbar,
    GridColDef,
    GridRenderCellParams,
    GridCellParams,
} from "@mui/x-data-grid";
import { useGetEmployeesQuery } from "../employeesEndpoints";
import { selectCompany } from "@/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Employee } from "@/types/employee/Employee.type";
import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Chip } from "@mui/material";
import EmployeeTableActions from "../components/EmployeeTableActions";
import { toggleDashboardLoading } from "@/features/dashboard/dashboardSlice";

function EmployeesPage() {
    const companyId = useSelector(selectCompany);
    const { data: employees = [], isLoading } = useGetEmployeesQuery(
        companyId
    ) as {
        data: Employee[];
        isLoading: boolean;
    };
    const dispatch = useDispatch();
    const [editedRowIds, setEditedRowIds] = useState<(number | string)[]>([]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading, dispatch]);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "image",
            headerName: "Image",
            width: 70,
            renderCell: (params) => {
                const avatarSrc = params.row.image;
                const firstName = params.row.first_name.charAt(0).toUpperCase();
                const lastName = params.row.last_name.charAt(0).toUpperCase();
                const initials = firstName + lastName;

                if (avatarSrc) {
                    return <Avatar alt={firstName} src={avatarSrc} />;
                } else {
                    return <Avatar>{initials}</Avatar>;
                }
            },
            disableExport: true,
        },
        {
            field: "first_name",
            headerName: "First name",
            width: 110,
            editable: true,
        },

        {
            field: "last_name",
            headerName: "Last name",
            width: 110,
            editable: true,
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "active",
            headerName: "Active",
            width: 120,
            renderCell: (params) => {
                if (params.row.active) {
                    return <Chip label="Active" color="success"></Chip>;
                }
                return <Chip label="Inactive" color="error"></Chip>;
            },
            valueGetter: (params) =>
                params.row.active ? "Active" : "Inactive",
        },
        {
            field: "role",
            headerName: "Role",
            width: 100,
        },
        { field: "phone", headerName: "Phone", width: 130 },
        { field: "address", headerName: "Address", width: 130 },

        { field: "work_start_date", headerName: "Work Start Date", width: 130 },
        {
            field: "work_end_date",
            headerName: "Work End Date",
            width: 130,
            renderCell: (params) => {
                if (params.row.work_end_date) {
                    return params.row.work_end_date;
                }
                return "-";
            },
        },
        {
            field: "department",
            headerName: "Department",
            width: 130,
            renderCell: (params) => {
                return params.row.department.name;
            },
            valueGetter: (params) => params.row.department.name,
        },
        {
            field: "position",
            headerName: "Position",
            width: 130,
            renderCell: (params) => {
                return params.row.position.title;
            },
            valueGetter: (params) => params.row.position.title,
        },
        {
            field: "reports_to",
            headerName: "Reports to",
            width: 130,
            renderCell: (params) => {
                if (params.row.reports_to) {
                    return `${params.row.reports_to.first_name} ${params.row.reports_to.last_name}`;
                }
                return "-";
            },
            valueGetter: (params) => {
                if (params.row.reports_to) {
                    return `${params.row.reports_to.first_name} ${params.row.reports_to.last_name}`;
                }
                return "-";
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <EmployeeTableActions
                    {...{
                        params,
                        editedRowIds,
                        onIdRemove: (id: string | number) => {
                            const newIds = editedRowIds.filter(
                                (existingId) => existingId !== id
                            );
                            setEditedRowIds(newIds);
                        },
                    }}
                />
            ),
        },
    ];

    // If employees data is changing frequently, useMemo to avoid unnecessary re-renderings.
    const rows = useMemo(
        () =>
            employees
                ? employees.map((employee) => ({
                      ...employee,
                      id: employee.id.toString(), // Ensure 'id' is a string
                      work_start_date: employee.work_start_date?.toString(), // Convert dates to string for display
                      work_end_date: employee.work_end_date?.toString(), // Convert dates to string for display
                  }))
                : [], // Return an empty array if `employees` is not yet defined
        [employees]
    );

    const handleSelectionModelChange = (_event: any) => {
        // console.log(_event);
    };

    const handleCellEditStop = (params: GridCellParams) => {
        // If the row ID isn't already in the editedRowIds array, add it
        if (!editedRowIds.includes(params.id)) {
            setEditedRowIds((prevIds) => [...prevIds, params.id]);
        }
    };

    return (
        <>
            <HeaderPageAddFeature
                headerTitle="Employees"
                buttonTitle="Add Employee"
                to={RouteList.createEmployee}
            />
            {employees.length > 0 && (
                <Box sx={{ width: "100%", marginTop: 4 }}>
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 15 },
                            },
                        }}
                        onRowSelectionModelChange={(value) => {
                            handleSelectionModelChange(value);
                        }}
                        pageSizeOptions={[10, 15, 20, 25]}
                        checkboxSelection
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        onCellEditStop={handleCellEditStop}
                    />
                </Box>
            )}
        </>
    );
}

export default EmployeesPage;
