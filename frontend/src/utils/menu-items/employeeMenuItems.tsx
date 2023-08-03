import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import { MenuItem } from "../../types/MenuItem.type";

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
        link: "/employees-details",
        title: "Employee Details",
        icon: GroupIcon,
    },
    documents: {
        link: "/documents",
        title: "Documents",
        icon: DescriptionIcon,
    },
    approveLeave: {
        link: "/approve-leave",
        title: "Approve Leave",
        icon: CheckIcon,
    },
};

interface EmployeeMenuItems {
    dashboard: MenuItem;
    profile: MenuItem;
    leaveRequestHistory: MenuItem;
    leaveRequestPost: MenuItem;
    companyDetails: MenuItem;
    employeesDetails: MenuItem;
    documents: MenuItem;
    approveLeave: MenuItem;
}
