import HeaderPageAddFeature from "@/components/ui/HeaderPageAddFeature";
import { selectCompany } from "@/features/auth/authSlice";
import RouteList from "@/routes/RouteList";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteLeaveTypeMutation,
    useGetLeaveTypesQuery,
} from "../leaveTypesEndpoints";
import {
    Box,
    Chip,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import FlexBetween from "@/components/ui/wrappers/FlexBetween";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModalContext } from "@/contexts/ModalContext";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import generateResponseMessage from "@/utils/helpers/generateResponseMessage";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";
import { useNavigate } from "react-router-dom";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import usePageTitle from "@/hooks/usePageTitle";

export default function LeaveTypesPage() {
    const companyId = useSelector(selectCompany);
    const theme = useTheme();
    const { data: leaveTypes = [], isLoading } =
        useGetLeaveTypesQuery(companyId);
    const { showModal } = useModalContext();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    usePageTitle("Leave Types");
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
                                <Stack
                                    boxShadow={4}
                                    p={2}
                                    borderRadius={4}
                                    bgcolor={theme.palette.background.paper}
                                >
                                    <FlexBetween>
                                        <Box
                                            color={
                                                theme.palette.primary
                                                    .contrastText
                                            }
                                        >
                                            {leaveType.type}
                                        </Box>
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
                                                    <EditIcon />
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

                                    <Box
                                        borderTop={1}
                                        display={"flex"}
                                        gap={1}
                                        my={2}
                                        pt={2}
                                        borderColor={
                                            theme.palette.primary.contrastText
                                        }
                                        color={
                                            theme.palette.primary.contrastText
                                        }
                                    >
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                textDecoration: "underline",
                                                textUnderlineOffset: 3,
                                            }}
                                        >
                                            Leaves:{" "}
                                        </Typography>

                                        {leaveType.limit
                                            ? leaveType.leave_amount
                                            : "Unlimited"}
                                    </Box>
                                    <Box>
                                        {leaveType.visible_to_employees ? (
                                            <Chip
                                                label="Visible"
                                                color="primary"
                                                sx={{
                                                    fontWeight: 500,
                                                    letterSpacing: 1,
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                label="Hide"
                                                color="error"
                                                sx={{
                                                    fontWeight: 500,
                                                    letterSpacing: 1,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Stack>
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
