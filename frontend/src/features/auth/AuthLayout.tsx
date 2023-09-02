import { RootState } from "@/app/store";
import BackdropLoading from "@/components/ui/BackdropLoading";
import { Box, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

function AuthLayout() {
    const theme = useTheme();
    const { isLoading } = useSelector((state: RootState) => state.dashboard);

    return (
        <Box
            bgcolor={theme.palette.background.default}
            height={{ xs: "100%", md: "100vh" }}
            overflow={"auto"}
        >
            <BackdropLoading isLoading={isLoading} />
            <Outlet />
        </Box>
    );
}

export default AuthLayout;
