import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { useSelector } from "react-redux";
import { selectDrawerWidth } from "../../../features/dashboard/dashboardSlice";
import EmployeeSidebarMenu from "../../../components/layout/AppLayout/EmployeeSidebarMenu";
import { RootState } from "../../../app/store";
import { UserRole } from "../../../features/auth/enums/UserRole";
import HrSidebarMenu from "../../../components/layout/AppLayout/HrSidebarMenu";

interface SidebarProps {
    open: boolean;
    handleDrawerClose: () => void;
}

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

export default function Sidebar({ open, handleDrawerClose }: SidebarProps) {
    const theme = useTheme();
    const drawerWidth = useSelector(selectDrawerWidth);
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <Drawer
            sx={{
                width: drawerWidth,

                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === "ltr" ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {user && user.role === UserRole.HR ? (
                    <HrSidebarMenu />
                ) : (
                    <EmployeeSidebarMenu />
                )}
            </List>
        </Drawer>
    );
}
