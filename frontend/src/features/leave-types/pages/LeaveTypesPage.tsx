import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import { selectCompany } from "@/features/auth/authSlice";
import RouteList from "@/routes/RouteList";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteLeaveTypeMutation,
    useGetLeaveTypesQuery,
} from "../leaveTypesEndpoints";
import { Box, Grid, IconButton, Tooltip, useTheme } from "@mui/material";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModalContext } from "@/contexts/ModalContext";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import generateResponseMessage from "@/utils/helpers/generateResponseMessage";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";
import { useNavigate } from "react-router-dom";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";

export default function LeaveTypesPage() {
    const companyId = useSelector(selectCompany);
    const theme = useTheme();
    const { data: leaveTypes = [], isLoading } =
        useGetLeaveTypesQuery(companyId);
    const { showModal } = useModalContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [
        deleteLeaveType,
        { isSuccess, isError: isDeleteError, isLoading: isDeleteLoading },
    ] = useDeleteLeaveTypeMutation();

    useToggleDashboardLoading(isDeleteLoading);

    const handleEditLeaveType = (id: number) => {
        navigate(RouteList.editLeaveType(id));
    };

    const handleDeleteLeaveType = (leaveTypeId: number) => {
        const onDeleteLeaveType = async () => {
            await deleteLeaveType({ companyId, leaveTypeId });

            if (isSuccess) {
                dispatch(
                    setSnackbar({
                        message: generateResponseMessage(
                            "Leave type",
                            "delete"
                        ),
                    })
                );
            }

            if (isDeleteError) {
                // TODO: Fix the error
                dispatch(
                    setSnackbar({
                        message: "Something went wrong. Please try again later",
                        severity: SnackBarSeverity.ERROR,
                    })
                );
            }
        };

        showModal(
            "Are you sure you want to delete this leave type?",
            onDeleteLeaveType
        );
    };

    return (
        <>
            <HeaderPageAddFeature
                to={RouteList.createLeaveType}
                buttonTitle={"Add a new Leave Type"}
                headerTitle={"Leave Types"}
            />

            {isLoading ? (
                <Box
                    mt={4}
                    boxShadow={4}
                    p={2}
                    borderRadius={4}
                    bgcolor={theme.palette.background.paper}
                >
                    Loading Leave Types....
                </Box>
            ) : leaveTypes.length > 0 ? (
                <Box mt={4}>
                    <Grid container spacing={4}>
                        {leaveTypes.map((leaveType) => (
                            <Grid key={leaveType.id} item xs={6} md={4}>
                                <Box
                                    boxShadow={4}
                                    p={2}
                                    borderRadius={4}
                                    bgcolor={theme.palette.background.paper}
                                >
                                    <FlexBetween>
                                        <Box color={theme.palette.primary.contrastText}>{leaveType.type}</Box>
                                        <Box>
                                            <Tooltip
                                                placement="top"
                                                title="Edit Leave Type"
                                            >
                                                <IconButton
                                                    color="info"
                                                    onClick={() =>
                                                        handleEditLeaveType(
                                                            leaveType.id
                                                        )
                                                    }
                                                >
                                                    <EditIcon  />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip
                                                placement="top"
                                                title="Delete Leave Type"
                                            >
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDeleteLeaveType(
                                                            leaveType.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </FlexBetween>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Box
                    mt={4}
                    boxShadow={4}
                    p={2}
                    borderRadius={4}
                    bgcolor={theme.palette.background.paper}
                    color={theme.palette.info.main}
                >
                    No leave Types
                </Box>
            )}
        </>
    );
}
