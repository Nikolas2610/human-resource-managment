import { Box, IconButton, Tooltip } from "@mui/material";
import { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridRenderCellParams } from "@mui/x-data-grid";
import FlexCenter from "@/components/ui/wrappers/FlexCenter";
import { useNavigate } from "react-router-dom";
import RouteList from "@/routes/RouteList";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
    useDeleteEmployeeMutation, useResetPasswordByRequestMutation,

} from "../employeesEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { selectCompany } from "@/features/auth/authSlice";
import useToggleDashboardLoading from "@/hooks/useToggleDashboardLoading";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import { useHandleServerError } from "@/hooks/useHandleServerError";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";
import { useModalContext } from "@/contexts/ModalContext";
import DescriptionIcon from "@mui/icons-material/Description";

export default function EmployeeTableActions({
    params,
}: EmployeeTableActionsProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showModal } = useModalContext();
    const companyId = useSelector(selectCompany);

    // RTK Query
    const [
        resetPasswordByRequest,
        {
            isLoading: isResetPasswordLoading,
            isSuccess: isResetPasswordSuccess,
            isError: isResetPasswordError,
            error: resetPasswordError,
        },
    ] = useResetPasswordByRequestMutation();

    const [
        deleteEmployee,
        {
            isLoading: isDeleteLoading,
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
        },
    ] = useDeleteEmployeeMutation();

    // Hooks
    useToggleDashboardLoading(isResetPasswordLoading);
    useToggleDashboardLoading(isDeleteLoading);
    useHandleServerError(isResetPasswordError, resetPasswordError);

    const handleEditEmployee = () => {
        const id = parseInt(params.id.toString(), 10);
        navigate(RouteList.editEmployee(id));
    };

    const handleResetPassword = () => {
        const id = parseInt(params.id.toString(), 10);
        resetPasswordByRequest({ companyId, employeeId: id });
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
        if (isResetPasswordSuccess) {
            dispatch(
                setSnackbar({
                    message: "Reset password has be done successfully.",
                })
            );
        }
    }, [isResetPasswordSuccess]);

    const handleViewDocuments = () => {
        const id = parseInt(params.id.toString(), 10);
        navigate(RouteList.employeeDocuments(id));
    }

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
                <Tooltip placement="top" title="View Documents">
                    <IconButton onClick={handleViewDocuments}>
                        <DescriptionIcon />
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
        </FlexCenter>
    );
}

interface EmployeeTableActionsProps {
    params: GridRenderCellParams;
}
