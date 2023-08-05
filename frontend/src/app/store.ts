import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import authReducer from "../features/auth/authSlice";
import snackbarReducer from "../features/snackbars/snackbarSlice";
import { apiService } from "../features/api/apiService";

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        auth: authReducer,
        snackbar: snackbarReducer,
        [apiService.reducerPath]: apiService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiService.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
