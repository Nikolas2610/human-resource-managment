import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SnackBarSeverity } from "./enums/SnackBarSeverity.enum";
import { SnackBarVertical } from "./enums/SnackBarVertical.enum";
import { SnackBarHorizontal } from "./enums/SnackBarHorizontal.enum";

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackBarSeverity;
    vertical: SnackBarVertical;
    horizontal: SnackBarHorizontal;
}

const initialState: SnackbarState = {
    open: false,
    message: "",
    severity: SnackBarSeverity.SUCCESS,
    vertical: SnackBarVertical.TOP,
    horizontal: SnackBarHorizontal.RIGHT,
};

const snackbarSlice = createSlice({
    name: "snackbar",
    initialState,
    reducers: {
        setSnackbar: (
            state,
            action: PayloadAction<{
                message: string;
                severity?: SnackBarSeverity;
                vertical?: SnackBarVertical;
                horizontal?: SnackBarHorizontal;
            }>
        ) => {
            const {
                message,
                severity = SnackBarSeverity.SUCCESS,
                vertical = SnackBarVertical.TOP,
                horizontal = SnackBarHorizontal.RIGHT,
            } = action.payload;

            state.open = true;
            state.message = message;
            state.severity = severity;
            state.vertical = vertical;
            state.horizontal = horizontal;
        },
        closeSnackbar: (state) => {
            state.open = false;
        },
    },
});

export const { setSnackbar, closeSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
