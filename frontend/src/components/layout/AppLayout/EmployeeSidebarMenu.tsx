import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";
import MenuLink from "./MenuLink";

const EmployeeSidebarMenu: React.FC = () => (
  <>
    <MenuLink to="/dashboard" primary="Dashboard" Icon={DashboardIcon} />
    <MenuLink to="/profile" primary="Profile" Icon={AccountBoxIcon} />
    <MenuLink to="/leave-request/post" primary="Post Leave Request" Icon={PostAddIcon} />
    <MenuLink to="/leave-request/history" primary="Leave Requests History" Icon={HistoryIcon} />
    <MenuLink to="/company-details" primary="Company Details" Icon={BusinessIcon} />
    <MenuLink to="/employees-details" primary="Employees Details" Icon={GroupIcon} />
    <MenuLink to="/documents" primary="Documents" Icon={DescriptionIcon} />
    <MenuLink to="/approve-leave" primary="Approve Leave Request" Icon={CheckIcon} />
  </>
);

export default EmployeeSidebarMenu;
