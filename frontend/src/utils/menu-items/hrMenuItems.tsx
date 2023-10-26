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
import PersonIcon from "@mui/icons-material/Person";
import SignpostIcon from "@mui/icons-material/Signpost";
import RouteList from "@/routes/RouteList";
import { SubscriptionAccessLevel } from "@/types/subscriptions/SubscriptionAccessLevel.enum";
import PaymentsIcon from "@mui/icons-material/Payments";
import WorkIcon from '@mui/icons-material/Work';

export const hrMenuItems: HRMenuItems = {
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
        icon: PersonIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    leaveType: {
        link: "/leave-types",
        title: "Leave Types",
        icon: SignpostIcon,
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
    approveLeave: {
        link: "/approve-leave",
        title: "Approve Leave",
        icon: CheckIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    departments: {
        link: "/departments",
        title: "Departments",
        icon: BusinessCenterIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    positions: {
        link: "/positions",
        title: "Positions",
        icon: AccountTreeIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    employees: {
        link: "/employees",
        title: "Employees",
        icon: PeopleIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    integrations: {
        link: "/settings",
        title: "Settings",
        icon: SettingsIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.EXPIRED,
            SubscriptionAccessLevel.LEVEL_ONE,
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
    payroll: {
        title: "Payroll",
        link: "/payroll",
        icon: PaymentsIcon,
        subscriptionAccessLevel: [SubscriptionAccessLevel.LEVEL_THREE],
    },
    jobPosing: {
        title: "Job Posting",
        link: "/job-posting",
        icon: WorkIcon,
        subscriptionAccessLevel: [
            SubscriptionAccessLevel.LEVEL_TWO,
            SubscriptionAccessLevel.LEVEL_THREE,
        ],
    },
};

interface HRMenuItems {
    dashboard: MenuItem;
    profile: MenuItem;
    leaveRequestHistory: MenuItem;
    leaveRequestPost: MenuItem;
    companyDetails: MenuItem;
    employeesDetails: MenuItem;
    approveLeave: MenuItem;
    integrations: MenuItem;
    employees: MenuItem;
    departments: MenuItem;
    positions: MenuItem;
    leaveType: MenuItem;
    payroll: MenuItem;
    jobPosing: MenuItem;
}
