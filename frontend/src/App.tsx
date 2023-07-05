import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { loginFailure, loginSuccess } from "./features/auth/authSlice";
import Routers from "./routes/Routers";
import { UserRole } from "./features/auth/enums/UserRole";
import { ThemeProvider } from "@mui/material";
import { themeSettings } from "./themes/theme";
import { useAppSelector } from "./app/hook";
import { PaletteMode } from '@mui/material';
import { createTheme } from "@mui/material/styles";

interface ThemeSettings {
  palette: {
    mode: PaletteMode,
  },
}

function App() {
    const { isLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { themeMode } = useAppSelector((state) => state.dashboard);
    // const theme = useMemo(
    //     () => createTheme(themeSettings(themeMode: PaletteMode): ThemeSettings),
    //     [themeMode]
    // );

   const theme = createTheme(themeSettings(themeMode))

    useEffect(() => {
        const token: string | null = localStorage.getItem("token");

        if (token) {
            dispatch(loginSuccess({ role: UserRole.HR }));
        } else {
            dispatch(loginFailure());
        }
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading...</div>; // Or any loading spinner
    }

    return (
        <ThemeProvider theme={theme}>
            <Routers />
        </ThemeProvider>
    );
}

export default App;
