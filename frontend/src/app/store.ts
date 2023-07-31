import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import authReducer from "../features/auth/authSlice";
import { apiService, apiServiceWithAuth } from "../features/api/apiService";

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        auth: authReducer,
        [apiService.reducerPath]: apiService.reducer,
        [apiServiceWithAuth.reducerPath]: apiServiceWithAuth.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiService.middleware)
            .concat(apiServiceWithAuth.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
