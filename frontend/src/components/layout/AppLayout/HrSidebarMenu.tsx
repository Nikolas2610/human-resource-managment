import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuLink from './MenuLink';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PostAddIcon from "@mui/icons-material/PostAdd";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckIcon from "@mui/icons-material/Check";

const HrSidebarMenu: React.FC = () => (
  <>
    <MenuLink to="/dashboard" primary="Dashboard" Icon={DashboardIcon} />
    <MenuLink to="/profile" primary="Profile" Icon={AccountBoxIcon} />
    <MenuLink to="/leave-request/post" primary="Post Leave Request" Icon={PostAddIcon} />
    <MenuLink to="/leave-request/history" primary="Leave Requests History" Icon={HistoryIcon} />
    <MenuLink to="/company-details" primary="Company Details" Icon={BusinessIcon} />
    <MenuLink to="/employees-details" primary="Employees Details" Icon={GroupIcon} />
    <MenuLink to="/documents" primary="Documents" Icon={DescriptionIcon} />
    <MenuLink to="/integrations" primary="Integrations" Icon={SettingsIcon} />
    <MenuLink to="/approve-leave" primary="Approve Leave Request" Icon={CheckIcon} />
    <MenuLink to="/edit-company" primary="Edit Company Info" Icon={EditIcon} />
    <MenuLink to="/employees" primary="Employees" Icon={PeopleIcon} />
    <MenuLink to="/departments" primary="Departments" Icon={BusinessCenterIcon} />
    <MenuLink to="/positions" primary="Positions" Icon={AccountTreeIcon} />
  </>
);

export default HrSidebarMenu;
