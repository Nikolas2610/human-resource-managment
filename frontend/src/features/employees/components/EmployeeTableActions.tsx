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

export default function EmployeeTableActions({
    params,
    editedRowIds,
    onIdRemove,
}: EmployeeTableActionsProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (isEdited && success) {
            setSuccess(false);
        }
    }, [editedRowIds]);

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
                <Tooltip placement="top" title="Delete Employee">
                    <IconButton color="error">
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
