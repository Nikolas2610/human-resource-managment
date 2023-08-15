import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { green } from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridRenderCellParams } from "@mui/x-data-grid";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
    useDeleteEmployeeMutation,
    useResetPasswordMutation,
} from "../employeesEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import { useHandleServerError } from "@/hooks/useHandleServerError";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";
import { useModalContext } from "@/contexts/ModalContext";

export default function EmployeeTableActions({
    params,
    editedRowIds,
    onIdRemove,
}: EmployeeTableActionsProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showModal } = useModalContext();
    const companyId = useSelector(selectCompany);

    // RTK Query
    const [
        resetPassword,
        {
            isLoading: isResetPasswordLoading,
            isSuccess: isResetPasswordSuccess,
            isError: isResetPasswordError,
            error: resetPasswordError,
        },
    ] = useResetPasswordMutation();

    const [
        deleteEmployee,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
        }
    ] = useDeleteEmployeeMutation();


    // Hooks
    useToggleDashboardLoading(isResetPasswordLoading);
    useToggleDashboardLoading(isDeleteLoading);
    useHandleServerError(isResetPasswordError, resetPasswordError);

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            console.log(`Update the ${params.id}`);

            onIdRemove(params.id); // remove the ID after updating
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    const handleEditEmployee = () => {
        const id = parseInt(params.id.toString(), 10);
        navigate(RouteList.editEmployee(id));
    };
    // Check if the current row id exists in editedRowIds
    const isEdited = editedRowIds.includes(params.id);

    const handleResetPassword = () => {
        const id = parseInt(params.id.toString(), 10);
        resetPassword({ companyId, employeeId: id });
    };

    const handleDeleteEmployee = () => {
        const id = parseInt(params.id.toString(), 10);
        const onDeleteEmployee = async () => {
            await deleteEmployee({ companyId, employeeId: id });

            if (isDeleteSuccess) {
                dispatch(
                    setSnackbar({
                        message: "Employee deleted successfully",
                    })
                );
            }

            if (isDeleteError) {
                dispatch(
                    setSnackbar({
                        message: "Employee not deleted",
                        severity: SnackBarSeverity.ERROR,
                    })
                );
            }
        };

        const fullName = params.row.first_name + " " + params.row.last_name;

        showModal(
            `Are you sure you want to delete ${fullName}?`,
            onDeleteEmployee
        );
    };

    useEffect(() => {
        if (isEdited && success) {
            setSuccess(false);
        }
    }, [editedRowIds]);

    useEffect(() => {
        if (isResetPasswordSuccess) {
            dispatch(
                setSnackbar({
                    message: "Reset password has be done successfully.",
                })
            );
        }
    }, [isResetPasswordSuccess]);

    return (
        <FlexCenter>
            <Box>
                <Tooltip placement="top" title="Edit Employee">
                    <IconButton color="info" onClick={handleEditEmployee}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box>
                <Tooltip placement="top" title="Reset Password Employee">
                    <IconButton color="info" onClick={handleResetPassword}>
                        <LockResetIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box>
                <Tooltip placement="top" title="Delete Employee">
                    <IconButton color="error" onClick={handleDeleteEmployee}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box position={"relative"}>
                {success ? (
                    <IconButton
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: green[500],
                            "&:hover": {
                                bgcolor: green[700],
                            },
                        }}
                    >
                        <CheckCircleIcon />
                    </IconButton>
                ) : (
                    <>
                        {!isEdited || loading ? (
                            <IconButton disabled={true}>
                                <SaveIcon />
                            </IconButton>
                        ) : (
                            <Tooltip placement="top" title="Save">
                                <IconButton
                                    onClick={handleSubmit}
                                    sx={{ bgcolor: green[700] }}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </>
                )}
                {loading && (
                    <CircularProgress
                        size={52}
                        sx={{
                            color: green[500],
                            position: "absolute",
                            top: -6,
                            left: -6,
                            zIndex: 1,
                        }}
                    />
                )}
            </Box>
        </FlexCenter>
    );
}

interface EmployeeTableActionsProps {
    params: GridRenderCellParams;
    editedRowIds: Array<number | string>;
    onIdRemove: (id: string | number) => void;
}
