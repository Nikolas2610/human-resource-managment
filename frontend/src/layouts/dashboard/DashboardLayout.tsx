import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import CustomAppBar from "./components/CustomAppBar";
import Sidebar from "./components/Sidebar";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    selectDrawerWidth,
    toggleDrawer,
} from "../../features/dashboard/dashboardSlice";
import { RootState } from "../../app/store";
import { Outlet } from "react-router-dom";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => {
    const drawerWidth = useSelector(selectDrawerWidth);

    return {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    };
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

export default function DashboardLayout() {
    const { drawerOpen } = useSelector((state: RootState) => state.dashboard);
    const dispatch = useDispatch();

    const handleDrawerOpen = () => {
        dispatch(toggleDrawer(true));
    };

    const handleDrawerClose = () => {
        dispatch(toggleDrawer(false));
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <CustomAppBar
                open={drawerOpen}
                handleDrawerOpen={handleDrawerOpen}
            />
            <Sidebar open={drawerOpen} handleDrawerClose={handleDrawerClose} />
            <Main open={drawerOpen}>
                <DrawerHeader />
                <Outlet />
            </Main>
        </Box>
    );
}
