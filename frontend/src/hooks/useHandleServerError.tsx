import { useAppDispatch } from "@/app/hook";
import { SnackBarSeverity } from "@/features/snackbars/enums/SnackBarSeverity.enum";
import { setSnackbar } from "@/features/snackbars/snackbarSlice";
import { useEffect } from "react";

interface ServerErrors {
    message: string;
    errors: {
        [key: string]: string[];
    };
}

export function useHandleServerError(isError: boolean, error: any) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isError) {
            if (
                error &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "message" in error.data &&
                error.data.message === "The given data was invalid."
            ) {
                const validationErrors = (error.data as ServerErrors).errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                const firstErrorMessage = validationErrors[firstErrorKey][0];

                dispatch(
                    setSnackbar({
                        message: firstErrorMessage,
                        severity: SnackBarSeverity.ERROR
                    })
                );
            } else {
                dispatch(
                    setSnackbar({
                        message: "Something went wrong",
                        severity: SnackBarSeverity.ERROR
                    })
                );
            }
        }
    }, [isError, error, dispatch]);
}
