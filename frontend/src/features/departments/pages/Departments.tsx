import {
    Alert,
    Box,
    Grid,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    setPageTitle,
    toggleDashboardLoading,
} from "../../dashboard/dashboardSlice";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import DeleteIcon from "@mui/icons-material/Delete";
import { Department } from "@/types/departments/Department.type";
import { useModalContext } from "@/contexts/ModalContext";
import {
    useDeleteDepartmentMutation,
    useGetDepartmentsQuery,
} from "../departmentEndpoints";
import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import { selectCompany } from "@/features/auth/authSlice";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";

function Departments() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const companyId = useSelector(selectCompany);
    const {
        data: departments = [],
        error,
        isError,
        isLoading,
    } = useGetDepartmentsQuery(companyId) as {
        data: Department[];
        error: unknown;
        isError: boolean;
        isLoading: boolean;
    };
    const { showModal } = useModalContext();
    const [
        deleteDepartment,
        { isSuccess, isError: isDeleteError, isLoading: isDeleteLoading },
    ] = useDeleteDepartmentMutation();

    useEffect(() => {
        dispatch(setPageTitle("Departments"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading, departments, error]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isDeleteLoading));
    }, [isDeleteLoading, dispatch]);

    const handleEditDepartment = (id: number) => {
        navigate(RouteList.editDepartment(id));
    };

    const handleDeleteDepartment = (id: number) => {
        const onDeleteDepartment = async () => {
            await deleteDepartment({ companyId, departmentId: id });

            if (isSuccess) {
                dispatch(
                    setSnackbar({
                        message: "Department deleted successfully",
                    })
                );
            }

            if (isDeleteError) {
                dispatch(
                    setSnackbar({
                        message: "Department deleted successfully",
                        severity: SnackBarSeverity.ERROR,
                    })
                );
            }
        };

        showModal(
            "Are you sure you want to delete this department?",
            onDeleteDepartment
        );
    };

    return (
        <>
            <HeaderPageAddFeature
                to={RouteList.createDepartment}
                buttonTitle={"Add a new Department"}
                headerTitle={"Departments"}
            />
            {isLoading ? (
                <Grid container mt={4} spacing={4}>
                    {[...Array(3)].map((_, index) => (
                        <Grid item key={index} xs={4}>
                            <Skeleton
                                variant="rectangular"
                                height={140}
                                sx={{ borderRadius: 4 }}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : isError || (departments && departments?.length === 0) ? (
                <Alert sx={{ marginTop: 4 }} severity="info">
                    There are no departments
                </Alert>
            ) : (
                <Grid container spacing={4} mt={4}>
                    {departments &&
                        departments?.map((department: Department) => (
                            <Grid
                                item
                                key={department.id}
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <Stack
                                    spacing={3}
                                    p={2}
                                    borderRadius={4}
                                    boxShadow={4}
                                    bgcolor={theme.palette.background.paper}
                                >
                                    <FlexBetween>
                                        <Typography
                                            variant="h4"
                                            color={theme.palette.primary.main}
                                        >
                                            {department.name}
                                        </Typography>
                                        <Box>
                                            <IconButton
                                                onClick={() =>
                                                    handleEditDepartment(
                                                        department.id as number
                                                    )
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteDepartment(
                                                        department.id as number
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </FlexBetween>

                                    <Box>
                                        <Box
                                            display={"flex"}
                                            gap={2}
                                            alignItems={"center"}
                                        >
                                            <AccessibilityNewIcon fontSize="large" />
                                            <Typography variant="h4">
                                                {department?.manager
                                                    ? department.manager
                                                          ?.first_name +
                                                      "" +
                                                      department.manager
                                                          ?.last_name
                                                    : "-"}
                                            </Typography>
                                        </Box>
                                        <Box
                                            display={"flex"}
                                            gap={2}
                                            mt={1}
                                            alignItems={"center"}
                                        >
                                            <PeopleIcon fontSize="large" />
                                            <Typography variant="h4">
                                                {department.num_employees}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        ))}
                </Grid>
            )}
        </>
    );
}

export default Departments;
