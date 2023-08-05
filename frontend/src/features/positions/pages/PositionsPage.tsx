import { RootState } from "@/app/store";
import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import RouteList from "@/routes/RouteList";
import { Position } from "@/types/positions/Position.type";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    useDeletePositionMutation,
    useGetPositionsQuery,
} from "../positionsEndpoints";
import { useEffect, useState } from "react";
import {
    setPageTitle,
    toggleDashboardLoading,
} from "@/features/dashboard/dashboardSlice";
import { useModalContext } from "@/contexts/ModalContext";
import {
    Alert,
    Autocomplete,
    Box,
    Grid,
    IconButton,
    Skeleton,
    Stack,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { useGetDepartmentsQuery } from "@/features/departments/departmentEndpoints";
import { Department } from "@/types/departments/Department.type";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";

export default function PositionsPage() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const companyId =
        useSelector((state: RootState) => state.auth.user?.company_id) || 0;
    const {
        data: positions = [],
        error,
        isError,
        isLoading,
    } = useGetPositionsQuery(companyId) as {
        data: Position[];
        error: unknown;
        isError: boolean;
        isLoading: boolean;
    };
    const { showModal } = useModalContext();
    const [
        deletePosition,
        { isSuccess, isError: isDeleteError, isLoading: isDeleteLoading },
    ] = useDeletePositionMutation();
    const [departmentId, setDepartmentId] = useState<string | number | null>(
        null
    );
    const { data: departments = [] } = useGetDepartmentsQuery(companyId) as {
        data: Department[];
    };

    useEffect(() => {
        dispatch(setPageTitle("Departments"));
    }, [dispatch]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isLoading));
    }, [isLoading, positions, error]);

    useEffect(() => {
        dispatch(toggleDashboardLoading(isDeleteLoading));
    }, [isDeleteLoading, dispatch]);

    const handleEditPosition = (id: number) => {
        navigate(RouteList.editPosition(id));
    };

    const handleDeletePosition = (id: number) => {
        const onDeleteDepartment = async () => {
            await deletePosition({ companyId, positionId: id });

            if (isSuccess) {
                dispatch(
                    setSnackbar({
                        message: "Position deleted successfully",
                    })
                );
            }

            if (isDeleteError) {
                dispatch(
                    setSnackbar({
                        message: "Failed to delete position",
                    })
                );
            }
        };

        showModal(
            "Are you sure you want to delete this position?",
            onDeleteDepartment
        );
    };

    return (
        <>
            <HeaderPageAddFeature
                headerTitle="Positions"
                buttonTitle="Add a new Position"
                to={RouteList.createPosition}
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
            ) : isError || (positions && positions?.length === 0) ? (
                <Alert severity="info">There are no positions</Alert>
            ) : (
                <>
                    {departments.length > 0 && (
                        <Box display={"flex"} justifyContent={"end"} mt={4}>
                            <Autocomplete
                                disablePortal
                                id="departments_filter"
                                options={departments.map((department) => ({
                                    label: department.name,
                                    id: department.id,
                                }))}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value.id
                                }
                                onChange={(_event, value) =>
                                    setDepartmentId(value ? value.id : null)
                                }
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Department" />
                                )}
                            />
                        </Box>
                    )}
                    <Grid container spacing={4} mt={0}>
                        {positions &&
                            positions
                                ?.filter((position) =>
                                    departmentId
                                        ? position.department.id ===
                                          departmentId
                                        : true
                                )
                                .map((position: Position) => (
                                    <Grid
                                        item
                                        key={position.id}
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <Stack
                                            spacing={3}
                                            p={2}
                                            borderRadius={4}
                                            boxShadow={4}
                                            bgcolor={
                                                theme.palette.background.paper
                                            }
                                        >
                                            <FlexBetween>
                                                <Typography
                                                    variant="h4"
                                                    color={
                                                        theme.palette.primary
                                                            .main
                                                    }
                                                >
                                                    {position.title}
                                                </Typography>
                                                <Box>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEditPosition(
                                                                position.id
                                                            )
                                                        }
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() =>
                                                            handleDeletePosition(
                                                                position.id
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </FlexBetween>

                                            <Box display={"flex"} gap={2}>
                                                <BusinessCenterIcon />

                                                <Typography>
                                                    {position.department.name}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                ))}
                    </Grid>
                </>
            )}
        </>
    );
}
