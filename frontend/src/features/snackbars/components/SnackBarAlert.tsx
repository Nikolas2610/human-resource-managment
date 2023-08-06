import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import {
    SnackbarState,
    closeSnackbar,
} from "@/features/snackbars/snackbarSlice";
import { RootState } from "@/app/store";

export default function SnackbarAlert() {
    const dispatch = useDispatch();
    const { open, message, severity, vertical, horizontal } = useSelector<
        RootState,
        SnackbarState
    >((state) => state.snackbar);

    const handleClose = (
        _event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        dispatch(closeSnackbar());
    };
    
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical, horizontal }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
