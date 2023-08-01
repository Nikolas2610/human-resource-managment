import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import {
    selectDrawerWidth,
    toggleThemeMode,
} from "../../../features/dashboard/dashboardSlice";
import { useTheme } from "@mui/material";
import { RootState } from "../../../app/store";
import FlexBetween from "../../../components/ui/wrappers/FlexBetween";
import ProfileMenuItem from "../../../components/layout/AppLayout/ProfileMenuItem";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { ThemeMode } from "../../../features/dashboard/enums/ThemeMode.enum";

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
    handleDrawerOpen?: () => void;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => {
    const drawerWidth = useSelector(selectDrawerWidth);
    return {
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundImage: "none",
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    };
});

export default function CustomAppBar({ open, handleDrawerOpen }: AppBarProps) {
    const { title, themeMode } = useSelector(
        (state: RootState) => state.dashboard
    );
    const theme = useTheme();
    const dispatch = useDispatch();

    const handleToggleTheme = () => {
        dispatch(toggleThemeMode());
    };

    return (
        <AppBar position="fixed" open={open}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: "none" }) }}
                >
                    <MenuIcon />
                </IconButton>

                <FlexBetween sx={{ width: "100%" }}>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                    <FlexBetween>
                        <IconButton
                            onClick={handleToggleTheme}
                            sx={{ color: theme.palette.primary.contrastText }}
                        >
                            {themeMode === ThemeMode.DARK ? (
                                <DarkModeOutlined sx={{ fontSize: "25px" }} />
                            ) : (
                                <LightModeOutlined sx={{ fontSize: "25px" }} />
                            )}
                        </IconButton>
                        <ProfileMenuItem />
                    </FlexBetween>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
}
