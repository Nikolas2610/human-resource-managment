import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import EmployeeSidebarMenu from "./EmployeeSidebarMenu";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../../features/auth/authSlice";
import { UserRole } from "../../../features/auth/enums/UserRole";
import HrSidebarMenu from "./HrSidebarMenu";

interface SidebarProps {
  open: boolean;
  handleToggleDrawer: () => void;
  drawerWidth: number;
  drawerCloseWidth: number;
}

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    // backgroundColor: theme.palette.primary.light,
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function Sidebar({
  open,
  handleToggleDrawer,
  drawerWidth,
  drawerCloseWidth,
}: SidebarProps) {
  const userRole = useSelector(selectUserRole);

  const adjustedStyles = {
    width: open ? drawerWidth : drawerCloseWidth,
  };

  return (
    <Drawer variant="permanent" open={open} style={adjustedStyles}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
        }}
      >
        <Box marginLeft={2}>
          <Typography variant="h6" textTransform={"capitalize"} color={"primary"}>
            Role: {userRole}
          </Typography>
        </Box>
        <IconButton onClick={handleToggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {userRole=== UserRole.EMPLOYEE 
        ? <EmployeeSidebarMenu />
        : <HrSidebarMenu />
        }
        {/* {mainListItems}
        <Divider sx={{ my: 1 }} />
        {secondaryListItems} */}
      </List>
    </Drawer>
  );
}
