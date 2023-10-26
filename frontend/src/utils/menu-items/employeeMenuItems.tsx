import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import { MenuItem } from "../../types/MenuItem.type";
import RouteList from "@/routes/RouteList";
import { SubscriptionAccessLevel } from "@/types/subscriptions/SubscriptionAccessLevel.enum";

export const employeeMenuItems: EmployeeMenuItems = {
    dashboard: {
        link: "/dashboard",
        title: "Dashboard",
        icon: DashboardIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    profile: {
        link: "/profile",
        title: "Profile",
        icon: AccountBoxIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    leaveRequestHistory: {
        link: "/leave-request-history",
        title: "Leave Request History",
        icon: HistoryIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    leaveRequestPost: {
        link: "/leave-request-post",
        title: "Post Leave Request",
        icon: PostAddIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    companyDetails: {
        link: "/company-details",
        title: "Company Details",
        icon: BusinessIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    employeesDetails: {
        link: RouteList.companyEmployees,
        title: "Employee Details",
        icon: GroupIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
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
