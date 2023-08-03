// React
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { useAppSelector } from "./app/hook";
import { setToken, setUser } from "./features/auth/authSlice";
import { useGetUserQuery } from "./features/api/apiService";
import { toggleAppLoading } from "./features/dashboard/dashboardSlice";

// Material UI
import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// Components
import Routers from "./routes/Routers";

// Others
import { themeSettings } from "./themes/theme";
import BackdropLoading from "./components/ui/BackdropLoading";


function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { themeMode, isAppLoading } = useAppSelector(
        (state) => state.dashboard
    );
    const { data, isLoading, error } = useGetUserQuery();
    const theme = createTheme(themeSettings(themeMode));
    const [prevIsLoading, setPrevIsLoading] = useState(isLoading);

    // If a token is stored in localStorage, dispatch it
    useEffect(() => {
        const token = localStorage.getItem("token");

        token ? dispatch(setToken(token)) : dispatch(toggleAppLoading(false));
    }, [dispatch]);

    // Track the loading state and navigate based on data or error
    useEffect(() => {
        if (prevIsLoading && !isLoading) {
            if (data) {
                dispatch(setUser(data));
                dispatch(toggleAppLoading(false));
                navigate(pathname ?? "/dashboard");
            } else if (error || !data) {
                dispatch(toggleAppLoading(false));
                navigate("/auth/login");
            }
        }
        
        setPrevIsLoading(isLoading);
    }, [isLoading, data, dispatch, navigate]);

    return (
        <ThemeProvider theme={theme}>
            {!isAppLoading ? (
                <Routers />
            ) : (
                <Box
                    height="100vh"
                    bgcolor={theme.palette.background.default}
                ></Box>
            )}
            <BackdropLoading isLoading={isAppLoading}/>
        </ThemeProvider>
    );
}

export default App;
