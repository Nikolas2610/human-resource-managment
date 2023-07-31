import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "./features/auth/authSlice";
import Routers from "./routes/Routers";
import { ThemeProvider } from "@mui/material";
import { themeSettings } from "./themes/theme";
import { useAppSelector } from "./app/hook";
import { createTheme } from "@mui/material/styles";
import { useGetUserQuery } from "./features/api/apiService";
import { useNavigate } from "react-router-dom";
import LoadingBackdrop from "./components/LoadingBackdrop";
import { setLoading } from "./features/dashboard/dashboardSlice";
import { useTheme } from "@emotion/react";

function App() {
    const dispatch = useDispatch();
    const { themeMode } = useAppSelector((state) => state.dashboard);
    const { data, isLoading } = useGetUserQuery();
    const navigate = useNavigate();

    // const theme = useMemo(
    //     () => createTheme(themeSettings(themeMode: PaletteMode): ThemeSettings),
    //     [themeMode]
    // );

    const theme = createTheme(themeSettings(themeMode));
    // const theme = useTheme();

    useEffect(() => {
        dispatch(setLoading(true));

        const token: string | null = localStorage.getItem("token");
        if (token) {
            dispatch(setToken(token));
        }
    }, [dispatch]);

    useEffect(() => {
        dispatch(setLoading(isLoading));
        if (data) {
            dispatch(setUser(data));
            navigate("/dashboard");
        }
    }, [isLoading]);

    return (
        <ThemeProvider theme={theme}>
            <Routers />
            <LoadingBackdrop />
        </ThemeProvider>
    );
}

export default App;
