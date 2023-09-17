import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import { MenuItem } from "../../types/MenuItem.type";
import RouteList from "@/routes/RouteList";

export const employeeMenuItems: EmployeeMenuItems = {
    dashboard: { link: "/dashboard", title: "Dashboard", icon: DashboardIcon },
    profile: { link: "/profile", title: "Profile", icon: AccountBoxIcon },
    leaveRequestHistory: {
        link: "/leave-request-history",
        title: "Leave Request History",
        icon: HistoryIcon,
    },
    leaveRequestPost: {
        link: "/leave-request-post",
        title: "Post Leave Request",
        icon: PostAddIcon,
    },
    companyDetails: {
        link: "/company-details",
        title: "Company Details",
        icon: BusinessIcon,
    },
    employeesDetails: {
        link: RouteList.companyEmployees,
        title: "Employee Details",
        icon: GroupIcon,
    },
};

interface EmployeeMenuItems {
    dashboard: MenuItem;
    profile: MenuItem;
    leaveRequestHistory: MenuItem;
    leaveRequestPost: MenuItem;
    companyDetails: MenuItem;
    employeesDetails: MenuItem;
}
