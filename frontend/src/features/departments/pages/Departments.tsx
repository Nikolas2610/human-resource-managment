import {
    Alert,
    Box,
    Button,
    Grid,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useGetDepartmentsQuery } from "../../api/apiService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useEffect } from "react";
import {
    setPageTitle,
    toggleDashboardLoading,
} from "../../dashboard/dashboardSlice";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
import RouteList from "../../../routes/routeList";
import EditIcon from "@mui/icons-material/Edit";
import FlexBetween from "../../../components/ui/wrappers/FlexBetween";
import DeleteIcon from "@mui/icons-material/Delete";
import { Department } from "../../../types/departments/Department.type";

function Departments() {
    const theme = useTheme();
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
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

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle("Departments"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading, departments, error]);

    return (
        <>
            <Box
                p={3}
                borderRadius={4}
                boxShadow={4}
                bgcolor={theme.palette.background.paper}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Typography variant="h3" fontWeight={700}>
                    Departments
                </Typography>
                <Link to={RouteList.createDepartment}>
                    <Button
                        variant={"contained"}
                        size="large"
                        startIcon={<AddIcon />}
                    >
                        Add a new Department
                    </Button>
                </Link>
            </Box>

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
                <Alert severity="info">There are no departments</Alert>
            ) : (
                <Grid container spacing={4} mt={4}>
                    {departments &&
                        departments?.map((department: Department) => (
                            <Grid item key={department.id} md={4}>
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
                                            <IconButton>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error">
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
                                                Psillovits
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
