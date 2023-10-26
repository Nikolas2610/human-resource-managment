// React
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { useAppSelector } from "./app/hook";
import { setToken, setUser } from "./features/auth/authSlice";
import { useGetUserQuery } from "./features/api/apiService";
import {
    toggleAppLoading,
    toggleDrawer,
} from "./features/dashboard/dashboardSlice";

// Material UI
import { Box } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// Components
import Routers from "./routes/Routers";

// Others
import { themeSettings } from "./themes/theme";
import BackdropLoading from "./components/ui/BackdropLoading";
import { ModalProvider } from "./contexts/ModalContext";
import ConfirmModal from "./components/modal/ConfirmModal";
import SnackbarAlert from "./features/snackbars/components/SnackBarAlert";
import { DynamicThemeProvider } from "./contexts/DynamicThemeProvider";
import { RootState } from "./app/store";
import { SubscriptionAccessLevel } from "./types/subscriptions/SubscriptionAccessLevel.enum";
import RouteList from "./routes/RouteList";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { themeMode } = useAppSelector(
        (state) => state.dashboard
    );
    const { isUserLoading } = useAppSelector((state: RootState) => state.auth);

    const { data, isLoading, error, isSuccess, isError } = useGetUserQuery();
    // const theme = createTheme(themeSettings(themeMode));
    const baseTheme = createTheme(themeSettings(themeMode));

    // If a token is stored in localStorage, dispatch it
    useEffect(() => {
        // Get token and get user
        const token = localStorage.getItem("token");
        token ? dispatch(setToken(token)) : dispatch(toggleAppLoading(false));

        const openDrawer = localStorage.getItem("openDrawer");
        if (openDrawer) {
            dispatch(toggleDrawer(openDrawer === "open"));
        }
    }, [dispatch]);

    // Track the loading state and navigate based on data or error
    useEffect(() => {
        if (isSuccess || isError) {
            if (data) {
                dispatch(setUser(data));
                dispatch(toggleAppLoading(false));
                console.log("Redirect");
                
                if (data.subscription_access_level === SubscriptionAccessLevel.EXPIRED) {
                    navigate(RouteList.subscription)
                } else {
                    navigate(pathname ?? RouteList.dashboard);
                }
            } else if (error || !data) {
                localStorage.removeItem("token");
                dispatch(setUser(null));
                dispatch(toggleAppLoading(false));
            }
        }
    }, [isSuccess, isError]);

    return (
        <DynamicThemeProvider baseTheme={baseTheme}>
            {!isUserLoading ? (
                <ModalProvider>
                    <ConfirmModal />
                    <Routers />
                    <SnackbarAlert />
                </ModalProvider>
            ) : (
                <Box
                    height="100vh"
                    bgcolor={baseTheme.palette.background.default}
                ></Box>
            )}
            <BackdropLoading isLoading={isLoading} />
        </DynamicThemeProvider>
    );
}

export default App;
