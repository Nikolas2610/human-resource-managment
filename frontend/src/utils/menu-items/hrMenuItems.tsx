import { MenuItem } from "../../types/MenuItem.type";
import SettingsIcon from "@mui/icons-material/Settings";
// import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
// import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from '@mui/icons-material/Person';
import SignpostIcon from '@mui/icons-material/Signpost';
import RouteList from "@/routes/RouteList";

export const hrMenuItems: HRMenuItems = {
    dashboard: { link: "/dashboard", title: "Dashboard", icon: DashboardIcon },
    profile: { link: "/profile", title: "Profile", icon: PersonIcon },
    leaveType: {
        link: "/leave-types",
        title: "Leave Types",
        icon: SignpostIcon
    },
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
    // documents: {
    //     link: "/documents",
    //     title: "Documents",
    //     icon: DescriptionIcon,
    // },
    approveLeave: {
        link: "/approve-leave",
        title: "Approve Leave",
        icon: CheckIcon,
    },
    departments: {
        link: "/departments",
        title: "Departments",
        icon: BusinessCenterIcon,
    },
    positions: {
        link: "/positions",
        title: "Positions",
        icon: AccountTreeIcon,
    },
    employees: {
        link: "/employees",
        title: "Employees",
        icon: PeopleIcon,
    },
    integrations: {
        link: "/settings",
        title: "Settings",
        icon: SettingsIcon,
    },
};

interface HRMenuItems {
    dashboard: MenuItem;
    profile: MenuItem;
    leaveRequestHistory: MenuItem;
    leaveRequestPost: MenuItem;
    companyDetails: MenuItem;
    employeesDetails: MenuItem;
    // documents: MenuItem;
    approveLeave: MenuItem;
    integrations: MenuItem;
    employees: MenuItem;
    departments: MenuItem;
    positions: MenuItem;
    leaveType: MenuItem;
}
