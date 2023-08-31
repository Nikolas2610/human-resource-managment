import { selectCompany } from "@/features/auth/authSlice";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDepartmentEmployeesQuery } from "../departmentEndpoints";
import { Alert, Box, Grid, Stack, Tooltip, Typography } from "@mui/material";
import RouteList from "@/routes/RouteList";
import usePageTitle from "@/hooks/usePageTitle";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import PeopleIcon from "@mui/icons-material/People";
import UserAvatar from "@/components/ui/UserAvatar";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import CollapsibleTable from "../components/CollapsibleTable";

export default function ViewDepartment() {
    const { departmentId } = useParams<{ departmentId: string }>();
    const companyId = useSelector(selectCompany);
    const navigate = useNavigate();
    usePageTitle("Departments");
    const {
        data: department,
        isLoading,
        isError,
    } = useGetDepartmentEmployeesQuery({
        companyId,
        departmentId: parseInt(departmentId ?? "0", 10),
    });

    if (isLoading) {
        return "Loading...";
    }

    if (isError || !department) {
        navigate(RouteList.departments);
    }

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "image",
            headerName: "Image",
            width: 80,
            renderCell: (params) => (
                <UserAvatar name={params.row.name} image={params.row.image} />
            ),
        },
        { field: "name", headerName: "Name", width: 130 },
        { field: "position", headerName: "Position", width: 130 },
        { field: "role", headerName: "Role", width: 130 },
        { field: "email", headerName: "Email", width: 130 },
        { field: "phone", headerName: "Phone", width: 130 },
        { field: "address", headerName: "Address", width: 130 },
        { field: "salary", headerName: "Salary", width: 130 },
        { field: "reports_to", headerName: "Reports To", width: 130 },
    ];

    return (
        <Stack>
            {department && (
                <>
                    <FlexBetween>
                        <Typography variant="h1">{department.name}</Typography>
                        <Box>
                            {department.manager_name && (
                                <Box
                                    display={"flex"}
                                    gap={2}
                                    alignItems={"center"}
                                >
                                    <Tooltip
                                        title="Manager"
                                        placement="top-start"
                                    >
                                        <AccessibilityNewIcon fontSize="large" />
                                    </Tooltip>
                                    <Typography variant="h4">
                                        {department.manager_name}
                                    </Typography>
                                </Box>
                            )}
                            <Box display={"flex"} gap={2} alignItems={"center"}>
                                <Tooltip
                                    title="Num. Of Employees:"
                                    placement="top-start"
                                >
                                    <PeopleIcon fontSize="large" />
                                </Tooltip>
                                <Typography variant="h4">
                                    {department.employees.length}
                                </Typography>
                            </Box>
                        </Box>
                    </FlexBetween>
                    <Typography variant="h3" mt={4}>
                        Employees List
                    </Typography>
                    <Box mt={4}>
                        {department.employees.length > 0 ? (
                            <Box sx={{ width: "100%", marginTop: 4 }}>
                                {/* <DataGrid
                                    autoHeight
                                    rows={department.employees}
                                    columns={columns}
                                    pageSizeOptions={[10, 15, 20, 25]}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                /> */}
                                <CollapsibleTable employees={department.employees} />
                            </Box>
                        ) : (
                            <Alert severity="info">
                                There are not employees in the department:
                                {department.name}
                            </Alert>
                        )}
                    </Box>
                </>
            )}
        </Stack>
    );
}
