import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import FlexBetween from "../../ui/wrappers/FlexBetween";
import ProfileMenuItem from "./ProfileMenuItem";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface NavbarProps extends MuiAppBarProps {
  open?: boolean;
  handleToggleDrawer: () => void;
  handleToggleTheme: () => void;
  themeMode: 'dark' | 'light';
  drawerWidth: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({
  open,
  handleToggleDrawer,
  handleToggleTheme,
  themeMode,
  drawerWidth
}: NavbarProps) {

  const adjustedStyles = {
    marginLeft: open ? drawerWidth : 0,
    width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
  };


  return (
    <AppBar position="absolute" open={open} style={adjustedStyles}>
      <Toolbar
        sx={{
          pr: "24px", // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleToggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
        <FlexBetween sx={{ gap: ".5rem" }}>
          <IconButton onClick={handleToggleTheme}>
            {themeMode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <ProfileMenuItem />
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}
