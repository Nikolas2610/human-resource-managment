import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
    const theme = useTheme();

    return (
        <Box
            bgcolor={theme.palette.background.default}
            height={"100vh"}
            overflow={"hidden"}
        >
            <Outlet />
        </Box>
    );
}

export default AuthLayout;
