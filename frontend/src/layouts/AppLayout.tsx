import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Navbar from "../components/layout/AppLayout/Navbar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { AppDispatch } from "../app/store";
import {
  toggleDrawerOpen,
  toggleThemeMode,
} from "../features/dashboard/dashboardSlice";
import Sidebar from "../components/layout/AppLayout/Sidebar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";


export default function AppLayout() {
  const drawerWidth: number = 300;
  const drawerCloseWidth: number = 72;
  const dispatch = useAppDispatch() as AppDispatch;
  const { themeMode, drawerOpen } = useAppSelector((state) => state.dashboard);

  const handleToggleTheme = () => {
    dispatch(toggleThemeMode());
  };

  const handleToggleDrawer = () => {
    dispatch(toggleDrawerOpen());
  };

  const defaultTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <>
      {/* <ThemeProvider theme={defaultTheme}> */}
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Navbar
            open={drawerOpen}
            handleToggleDrawer={handleToggleDrawer}
            handleToggleTheme={handleToggleTheme}
            themeMode={themeMode}
            drawerWidth={drawerWidth}
          />
          <Sidebar
            open={drawerOpen}
            handleToggleDrawer={handleToggleDrawer}
            drawerWidth={drawerWidth}
            drawerCloseWidth={drawerCloseWidth}
          />
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "hidden",
              width: `calc(100vw - ${drawerOpen ? drawerWidth : drawerCloseWidth}px)`,
              transition: "none",
            }}
          >
            <Toolbar />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
              {/* Website content */}
              <Outlet />
            </Container>
          </Box>
        </Box>
      {/* </ThemeProvider> */}
    </>
  );
}
